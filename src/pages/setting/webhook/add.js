import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import AddSubscriber from '@components/admin/settings/integrations/webhook/AddSubscriber'
// import ShopItemFormProvider from '@context/ShopItemsContext'


const AdminAddWebhookSubscriber = () => {

  return (
    // <ShopItemFormProvider>
    <AddSubscriber />
    // </ShopItemFormProvider>
  )
}

AdminAddWebhookSubscriber.Layout = AdminLayout
AdminAddWebhookSubscriber.requireAdmin = true
export default AdminAddWebhookSubscriber

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
