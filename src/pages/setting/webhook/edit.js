import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import AddSubscriber from '@components/admin/settings/integrations/webhook/AddSubscriber'

const AdminEditWebhookSubscriber = () => {
  const router = useRouter()
  const { query: { id } } = router;
  return (
    <></>
    // <ShopItemFormProvider>
    // <AddSubscriber />
    // </ShopItemFormProvider>
  )
}

AdminEditWebhookSubscriber.Layout = AdminLayout
AdminEditWebhookSubscriber.requireAdmin = true
export default AdminEditWebhookSubscriber

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
