import Enums from 'enums'
import React from 'react'
import { Formik } from 'formik'
import { object, string, number } from 'yup'
import { GridItem, useToast } from '@chakra-ui/react'
import { useAdminQuestUpsert } from '@hooks/admin/quest'
import { AdminQuestFormWrapper } from '../AddQuest'
import moment from 'moment'
import { QuestStyle, QuestDuration } from '@prisma/client'
import { RequiredInput, NonRequiredTextInput } from '@components/shared/Formik'
import { useRouter } from 'next/router'

const DailyQuestSchema = object().shape({
  text: string().required('Quest text is required'),
  description: string().required('Quest description is required'),
  completedText: string().required('Complete Text is required'),
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
    frequently: string().required('A frequently identity is required!'),
    questRule: string().required('A rule identity is required!'),
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

const DailyQuestForm = ({ quest = null, isCreate = true }) => {
  const initialValues = {
    type: Enums.DAILY_QUEST,
    extendedQuestData: quest?.extendedQuestData ?? {
      frequently: 'daily',
      questRule: 'any',
      startDate: moment.utc(new Date().toISOString()).format('MM/DD/yyyy'),
      endDate: moment.utc(new Date().toISOString()).format('MM/DD/yyyy'),
    },
    text: quest?.text || 'Daily Free Point',
    description: quest?.description ?? 'Allow user to claim free point on frequently basis',
    completedText: quest?.completedText || 'Completed',
    rewardTypeId: quest?.rewardTypeId || 1,
    quantity: quest?.quantity || 0,
    isEnabled: quest?.isEnabled ?? true,
    isRequired: quest?.isRequired ?? false,
    id: quest?.id || 0,
    style: quest?.style || QuestStyle.NORMAL,
    image: quest?.image || '',
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
          description: `Mutate quest success`,
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
      validationSchema={DailyQuestSchema}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={onSubmit}
    >
      {({ values, errors, status, touched, handleChange, setFieldValue, dirty }) => {
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
                label={'Frequent Rule (Enter daily for rule)'}
                fieldName="extendedQuestData.frequently"
                error={errors?.extendedQuestData?.frequently}
                touched={touched?.extendedQuestData?.frequently}
              />
            </GridItem>

            <GridItem colSpan={2}>
              <RequiredInput
                label={'Rule (Enter "any" for rule)'}
                fieldName="extendedQuestData.questRule"
                error={errors?.extendedQuestData?.questRule}
                touched={touched?.extendedQuestData?.questRule}
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

export default DailyQuestForm
