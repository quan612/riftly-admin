import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'

import dynamic from 'next/dynamic'
const AdminRedeemableSettingComponent = dynamic(() =>
  import('@components/admin/settings/redeemable-contract/AdminRedeemableSetting'),
)

const AdminRedeemableSettingPage = ({ session }) => {
  return <AdminRedeemableSettingComponent />
}

AdminRedeemableSettingPage.Layout = AdminLayout
AdminRedeemableSettingPage.requireAdmin = true
export default AdminRedeemableSettingPage

import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
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
