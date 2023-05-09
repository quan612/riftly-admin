import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import AddSubscriber from '@components/admin/settings/integrations/webhook/AddSubscriber'

const AdminAddWebhookSubscriber = () => {

  return (
    <AddSubscriber />
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
