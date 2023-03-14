import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'

import dynamic from 'next/dynamic'
const AdminSMSSettingComponent = dynamic(() =>
  import('@components/admin/settings/sms/AdminSmsSetting'),
)

const AdminSMSSettingPage = () => {
  return <AdminSMSSettingComponent />
}

AdminSMSSettingPage.Layout = AdminLayout
AdminSMSSettingPage.requireAdmin = true
export default AdminSMSSettingPage

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
