import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
const ShopItemListComponent = dynamic(() => import('@components/admin/reward/shop/ShopItemList'))

const AdminShopRewardPage = () => {
  return (
    <ShopItemFormProvider>
      <ShopItemListComponent />
    </ShopItemFormProvider>
  )
}

AdminShopRewardPage.Layout = AdminLayout
AdminShopRewardPage.requireAdmin = true
export default AdminShopRewardPage

import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import ShopItemFormProvider from '@context/ShopItemsContext'

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
