import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import AddShopItem from '@components/admin/reward/shop/AddShopItem'
import ShopItemFormProvider from '@context/ShopItemsContext'


const AdminAddShopItem = () => {

  return (
    <ShopItemFormProvider>
      <AddShopItem />
    </ShopItemFormProvider>
  )
}

AdminAddShopItem.Layout = AdminLayout
AdminAddShopItem.requireAdmin = true
export default AdminAddShopItem

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session || session?.user?.isAdmin === false) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}
