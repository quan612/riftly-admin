import { IntegrationItemsContext } from '@context/IntegrationItemsContext'
import { useContext } from 'react'
import WebhookFormWrapper from './WebhookFormWrapper'

export default function EditSubscriber({}) {
  const { editItem } = useContext(IntegrationItemsContext)

  console.log(editItem)
  return <>{editItem && <WebhookFormWrapper item={editItem} isCreate={false} />}</>
}
