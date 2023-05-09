import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import EditShopItem from '@components/admin/reward/shop/EditShopItem'
import ShopItemFormProvider from '@context/ShopItemsContext'
import { useRouter } from 'next/router'

const AdminEditShopItem = () => {
  const router = useRouter()
  const { query: { id } } = router;
  return (
    <ShopItemFormProvider id={id}>
      <EditShopItem />
    </ShopItemFormProvider>
  )
}

AdminEditShopItem.Layout = AdminLayout
AdminEditShopItem.requireAdmin = true
export default AdminEditShopItem

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
