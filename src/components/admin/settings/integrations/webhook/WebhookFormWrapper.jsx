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
