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

const TwitterQuestSchema = object().shape({
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
    startDate: string().test('valid startDate', 'Start Date is not valid!', function () {
      const { from } = this
      const { startDate } = from[0].value // first ancestor
      const { duration } = from[1].value // root ancestor

      if (duration === QuestDuration.ONGOING) return true

      if (duration === QuestDuration.LIMITED && !startDate) {
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

const TwitterAuthQuestForm = ({ quest = null, isCreate = true }) => {
  const initialValues = {
    type: Enums.TWITTER_AUTH,
    extendedQuestData: quest?.extendedQuestData ?? {
      startDate: moment.utc(new Date()),
      endDate: moment.utc(new Date()),
    },
    text: quest?.text || 'Authenticate your Twitter',
    description: quest?.description ?? 'Require the user to authenticate their Twitter Id',
    completedText: quest?.completedText || 'Completed',
    rewardTypeId: quest?.rewardTypeId || 1,
    quantity: quest?.quantity || 0,
    isEnabled: quest?.isEnabled ?? true,
    isRequired: quest?.isRequired ?? true,
    id: quest?.id || 0,
    style: quest?.style || QuestStyle.NORMAL,
    image: quest?.image || '',
    duration: quest?.duration || QuestDuration.ONGOING,
  }

  const { isLoading, mutateAsync } = useAdminQuestUpsert()
  const toast = useToast()

  const onSubmit = async (fields, { setStatus }) => {
    try {
      let res = await mutateAsync(fields)
      if (res?.isError) {
        setStatus(res.message)
      } else {
        console.log(res)
        toast({
          title: 'Success',
          description: `Mutate quest success`,
          position: 'bottom-right',
          status: 'success',
          duration: 2000,
        })
      }
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={TwitterQuestSchema}
      validateOnBlur={true}
      validateOnChange={false}
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
        return <AdminQuestFormWrapper {...childrenProps} />
      }}
    </Formik>
  )
}

export default TwitterAuthQuestForm
