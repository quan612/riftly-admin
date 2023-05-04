import Enums from 'enums'
import React from 'react'
import { Formik } from 'formik'
import { object, string, number, of, array } from 'yup'
import { useToast } from '@chakra-ui/react'

import { useRouter } from 'next/router'

import WebhookForm from './WebhookForm'
import { IntegrationType } from '@models/Integration-type'
import { useWebhookMutation } from '@hooks/admin/integration'

const WebhookItemSchema = object().shape({
  url: string().required('Url is required'),
  description: string().required('Description is required'),
  // available: number()
  //   .required('Available Quantity is required')
  //   .min(1)
  //   .test('Test available valid', 'Available cannot be less than old available', function () {
  //     const { from } = this
  //     const { available, previous_available } = from[0].value

  //     if (available < previous_available) {
  //       return false
  //     }
  //     return true
  //   })
  //   .test(
  //     'Test available against maxPerAccout',
  //     'Available cannot be less than maxPerAccout',
  //     function () {
  //       const { from } = this
  //       const { available, maxPerAccount } = from[0].value

  //       if (parseInt(available) < parseInt(maxPerAccount)) {
  //         return false
  //       }
  //       return true
  //     },
  //   ),
  // maxPerAccount: number()
  //   .required('Max Per Account is required')
  //   .min(1)
  //   .test(
  //     'Test maxPerAccount valid',
  //     'Max per account cannot be less than old max per account',
  //     function () {
  //       const { from } = this
  //       const { maxPerAccount, previous_maxPerAccount } = from[0].value

  //       if (maxPerAccount < previous_maxPerAccount) {
  //         return false
  //       }
  //       return true
  //     },
  //   ),
  // image: string().required('Image is required'),

  // extendedQuestData: object().shape({
  //   frequently: string().required('A frequently identity is required!'),
  //   questRule: string().required('A rule identity is required!'),
  //   startDate: string().test('valid startDate', 'Start Date is not valid!', function () {
  //     const { from } = this
  //     const { startDate, endDate } = from[0].value // first ancestor
  //     const { duration } = from[1].value // root ancestor

  //     if (duration === QuestDuration.ONGOING) return true

  //     if (duration === QuestDuration.LIMITED && !startDate) {
  //       return false
  //     }
  //     if (duration === QuestDuration.LIMITED && !endDate) {
  //       return false
  //     }
  //     const dayDiff = moment(new Date(endDate).toISOString()).diff(
  //       moment(new Date(startDate).toISOString()),
  //       'days',
  //       false,
  //     )
  //     if (duration === QuestDuration.LIMITED && dayDiff < 0) {
  //       return false
  //     }

  //     return true
  //   }),
  //   endDate: string().test('valid endDate', 'End Date is not valid!', function () {
  //     try {
  //       const { from } = this
  //       const { startDate, endDate } = from[0].value
  //       const { duration } = from[1].value
  //       if (duration === QuestDuration.ONGOING) return true

  //       if (duration === QuestDuration.LIMITED && !startDate) {
  //         return false
  //       }
  //       if (duration === QuestDuration.LIMITED && !endDate) {
  //         return false
  //       }
  //       const dayDiff = moment(new Date(endDate).toISOString()).diff(
  //         moment(new Date(startDate).toISOString()),
  //         'days',
  //         false,
  //       )
  //       if (duration === QuestDuration.LIMITED && dayDiff < 0) {
  //         return false
  //       }
  //       return true
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }),
  // }),
  // multiplier: number().required('Multiplier is required to be at least 1').min(1),
  // requirements: array().of(
  //   object({
  //     requirementType: string().required('Requirement Type is required'),
  //     relationId: string().test(
  //       'Test relationId valid',
  //       'Invalid relationId of requirement',
  //       function () {
  //         const { from } = this
  //         const { relationId } = from[0].value
  //         if (relationId === '0' || relationId === 0 || relationId === '') {
  //           return false
  //         }
  //         return true
  //       },
  //     ),
  //     conditional: object().shape({
  //       has: number().test(
  //         'Conditional Valid',
  //         'Invalid reward requirement, requirement conditional less than 1',
  //         function () {
  //           const { from } = this
  //           const { has } = from[0].value
  //           const { requirementType } = from[1].value

  //           if (requirementType === RequirementType.QUEST) {
  //             return true
  //           }
  //           if (
  //             (requirementType === RequirementType.REWARD ||
  //               requirementType === RequirementType.LOGIN) &&
  //             has < 1
  //           ) {
  //             return false
  //           }
  //           return true
  //         },
  //       ),
  //     }),
  //   }),
  // ),
})

const WebhookFormWrapper = ({ item = null, isCreate = true }) => {
  const initialValues = {
    id: item?.id || 0,
    url: item?.url || '',
    description: item?.description ?? '',

    type: item?.type || IntegrationType.SHOP_ITEM,
    eventId: item?.eventId || 0,
    eventName: item?.eventName || '',
    isEnabled: item?.isEnabled ?? true,
    okToSave: item?.url ? true : false,
  }

  const [data, isLoading, mutateAsync] = useWebhookMutation()
  const toast = useToast()
  const router = useRouter()

  const onSubmit = async (fields, { setStatus }) => {
    try {
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))
      setStatus(null)
      console.log('fields', fields)
      const payload = {
        ...fields,
      }

      let op = await mutateAsync(payload)

      if (op.isError) {
        setStatus(op.message)
      } else {
        toast({
          title: 'Succeed',
          description: `Operation successful`,
          position: 'bottom-right',
          status: 'success',
          duration: 2000,
        })
        router.push('/setting/webhook/list')
      }
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={WebhookItemSchema}
      validateOnBlur={false}
      validateOnChange={false}
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
          handleChange,
        }
        return <WebhookForm {...childrenProps}></WebhookForm>
      }}
    </Formik>
  )
}

export default WebhookFormWrapper
