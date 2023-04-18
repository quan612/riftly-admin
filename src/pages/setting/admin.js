import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'

import dynamic from 'next/dynamic'
const AdminSettingComponent = dynamic(() =>
  import('@components/admin/settings/admin/AdminSetting'),
)

const AdminsSettingPage = () => {
  return <AdminSettingComponent />
}

AdminsSettingPage.Layout = AdminLayout
AdminsSettingPage.requireAdmin = true
export default AdminsSettingPage

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
