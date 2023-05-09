import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import EditSubscriber from '@components/admin/settings/integrations/webhook/EditSubscriber'
import { useRouter } from 'next/router'
import IntegrationItemsProvider from '@context/IntegrationItemsContext'

const AdminEditWebhookSubscriber = () => {
  const router = useRouter()
  const { query: { id } } = router;
  return (

    <IntegrationItemsProvider id={id}>
      <EditSubscriber />
    </IntegrationItemsProvider>
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
