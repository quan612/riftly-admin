import React, { useContext } from 'react'
import ShopItemForm from './Form/ShopItemForm'
import { ShopItemsContext } from '@context/ShopItemsContext'

export default function EditShopItem() {
  const { editItem } = useContext(ShopItemsContext)

  return <>{editItem && <ShopItemForm item={editItem} isCreate={false} />}</>
}
