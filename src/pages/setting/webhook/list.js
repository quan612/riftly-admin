import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
const IntegrationListComponent = dynamic(() => import('@components/admin/settings/integrations/IntegrationList'))

const AdminShopRewardIntegrationPage = () => {
  return (
    <IntegrationItemsProvider>
      <IntegrationListComponent />
    </IntegrationItemsProvider>
  )
}

AdminShopRewardIntegrationPage.Layout = AdminLayout
AdminShopRewardIntegrationPage.requireAdmin = true
export default AdminShopRewardIntegrationPage

import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import IntegrationItemsProvider from '@context/IntegrationItemsContext'


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
