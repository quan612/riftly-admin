import React, { useState, useEffect, useCallback } from 'react'
import { useAdminShopQuery } from '@hooks/admin/shop-item'
import { useWebhookQuery } from '@hooks/admin/integration'

export const IntegrationItemsContext = React.createContext<any | null>(null)

const IntegrationItemsProvider = ({ id = null, children }) => {
  const [editItem, editItemSet] = useState(null)

  const { data: webhookItems, isLoading: isLoadingWebhookItems } = useWebhookQuery()
  useEffect(() => {
    if (id && webhookItems && webhookItems.length > 0) {
      const selectedItem = webhookItems?.filter((q) => parseInt(q.id) === parseInt(id))[0]
      editItemSet(selectedItem)
    }
  }, [webhookItems, id])
  return (
    <IntegrationItemsContext.Provider
      value={{
        webhookItems,
        isLoadingWebhookItems,
        editItem,
      }}
    >
      {children}
    </IntegrationItemsContext.Provider>
  )
}

export default IntegrationItemsProvider
