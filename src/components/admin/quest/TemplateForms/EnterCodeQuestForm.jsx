import Enums from 'enums'
import React from 'react'
import { Formik } from 'formik'
import { object, string, number } from 'yup'
import { GridItem, useToast } from '@chakra-ui/react'
import { useAdminQuestUpsert } from '@hooks/admin/quest'
import { AdminQuestFormWrapper } from '../AddQuest'
import moment from 'moment'
import { NonRequiredTextInput, RequiredInput } from '@components/shared/Formik'
import { QuestStyle, QuestDuration } from '@prisma/client'
import { useRouter } from 'next/router'

const CodeQuestSchema = object().shape({
  text: string().required('Quest text is required'),
  description: string().required('Quest description is required'),
  completedText: string().required('Completed Text is required'),
  quantity: number().required().min(1),
  image: string().test(
    'valid image',
    'Image is required when quest style is Featured!',
    function () {
      if (this.parent.style === QuestStyle.NORMAL) return true
      const { image } = this.parent
      if (this.parent.style === QuestStyle.FEATURED && (!image || this.parent.image.length < 10)) {
        return false
      }
      return true
    },
  ),
  extendedQuestData: object().shape({
    codeEvent: string().required('An unique event is needed!'),
    secretCode: string().required('A secret code is required!'),
    startDate: string().test('valid startDate', 'Start Date is not valid!', function () {
      const { from } = this
      const { startDate, endDate } = from[0].value // first ancestor
      const { duration } = from[1].value // root ancestor

      if (duration === QuestDuration.ONGOING) return true

      if (duration === QuestDuration.LIMITED && !startDate) {
        return false
      }
      if (duration === QuestDuration.LIMITED && !endDate) {
        return false
      }
      const dayDiff = moment(new Date(endDate).toISOString()).diff(
        moment(new Date(startDate).toISOString()),
        'days',
        false,
      )
      if (duration === QuestDuration.LIMITED && dayDiff < 0) {
        return false
      }

      return true
    }),
    endDate: string().test('valid endDate', 'End Date is not valid!', function () {
      try {
        const { from } = this
        const { startDate, endDate } = from[0].value
        const { duration } = from[1].value
        if (duration === QuestDuration.ONGOING) return true

        if (duration === QuestDuration.LIMITED && !startDate) {
          return false
        }
        if (duration === QuestDuration.LIMITED && !endDate) {
          return false
        }
        const dayDiff = moment(new Date(endDate).toISOString()).diff(
          moment(new Date(startDate).toISOString()),
          'days',
          false,
        )
        if (duration === QuestDuration.LIMITED && dayDiff < 0) {
          return false
        }
        return true
      } catch (error) {
        console.log(error)
      }
    }),
  }),
})

const EnterCodeQuestForm = ({ quest = null, isCreate = true }) => {
  const initialValues = {
    type: Enums.CODE_QUEST,
    extendedQuestData: quest?.extendedQuestData ?? {
      codeEvent: '',
      secretCode: '',
      collaboration: '',
      others: '',
      startDate: moment.utc(new Date().toISOString()).format('MM/DD/yyyy'),
      endDate: moment.utc(new Date().toISOString()).format('MM/DD/yyyy'),
    },
    text: quest?.text || 'Code Quest For Event',
    description: quest?.description ?? 'Allow the user to enter a code and claim points',
    completedText: quest?.completedText || 'Completed',
    rewardTypeId: quest?.rewardTypeId || 1,
    quantity: quest?.quantity || 0,
    isEnabled: quest?.isEnabled ?? true,
    isRequired: quest?.isRequired ?? false,
    id: quest?.id || 0,
    image: quest?.image || '',
    style: quest?.style || QuestStyle.NORMAL,
    duration: quest?.duration || QuestDuration.ONGOING,
  }
  const { isLoading, mutateAsync } = useAdminQuestUpsert()
  const toast = useToast()
  const router = useRouter()

  const onSubmit = async (fields, { setStatus }) => {
    try {
      let res = await mutateAsync(fields)
      console.log(res)
      if (res?.isError) {
        setStatus(res.message)
      } else {
        toast({
          title: 'Success',
          description: `Update quest success`,
          position: 'bottom-right',
          status: 'success',
          duration: 2000,
        })
        router.push('/quest')
      }
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CodeQuestSchema}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={onSubmit}
    >
      {({ values, errors, status, touched, setFieldValue, dirty }) => {
        const childrenProps = {
          isCreate,
          isLoading,
          status,
          values,
          errors,
          touched,
          dirty,
          setFieldValue,
        }
        return (
          <AdminQuestFormWrapper {...childrenProps}>
            <GridItem colSpan={2}>
              <RequiredInput
                label={'Event Name'}
                fieldName="extendedQuestData.codeEvent"
                error={errors?.extendedQuestData?.codeEvent}
                touched={touched?.extendedQuestData?.codeEvent}
              />
            </GridItem>

            <GridItem colSpan={2}>
              <RequiredInput
                label={'Secret Answer'}
                fieldName="extendedQuestData.secretCode"
                error={errors?.extendedQuestData?.secretCode}
                touched={touched?.extendedQuestData?.secretCode}
              />
            </GridItem>

            <GridItem colSpan={2}>
              <NonRequiredTextInput
                label={'Other Answers (answer 1,answer 2,answer 3)'}
                fieldName="extendedQuestData.otherAnswers"
              />
            </GridItem>

            <GridItem colSpan={2}>
              <NonRequiredTextInput
                label={'Collaboration (leaving blank for non specific collaboration)'}
                fieldName="extendedQuestData.collaboration"
              />
            </GridItem>
          </AdminQuestFormWrapper>
        )
      }}
    </Formik>
  )
}

export default EnterCodeQuestForm
