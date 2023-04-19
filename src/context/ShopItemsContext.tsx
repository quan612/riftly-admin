import React, { useState, useEffect, useCallback } from 'react'
import { useAdminShopQuery } from '@hooks/admin/shop-item'

export const ShopItemsContext = React.createContext<any | null>(null)

const ShopItemFormProvider = ({ id = null, children }) => {
  const [itemType, itemTypeSelect] = useState(null)
  const [editItem, editItemSet] = useState(null)
  const itemTypes = [
    {
      name: 'Off Chain - No Contract',
    },
    {
      name: 'On Chain - With Contract',
    },
  ]

  const { data: shopItems, isLoading: isLoadingShopItems } = useAdminShopQuery()
  useEffect(() => {
    if (id && shopItems && shopItems.length > 0) {
      const selectedItem = shopItems?.filter((q) => parseInt(q.id) === parseInt(id))[0]
      editItemSet(selectedItem)
    }
  }, [shopItems, id])
  return (
    <ShopItemsContext.Provider
      value={{ itemType, itemTypeSelect, itemTypes, editItem, shopItems, isLoadingShopItems }}
    >
      {children}
    </ShopItemsContext.Provider>
  )
}

export default ShopItemFormProvider
