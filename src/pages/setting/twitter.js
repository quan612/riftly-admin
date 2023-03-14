import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'

import dynamic from 'next/dynamic'
const AdminTwitterSettingComponent = dynamic(() =>
  import('@components/admin/settings/twitter/AdminTwitterSetting'),
)

const AdminTwitterSettingPage = () => {
  return <AdminTwitterSettingComponent />
}

AdminTwitterSettingPage.Layout = AdminLayout
AdminTwitterSettingPage.requireAdmin = true
export default AdminTwitterSettingPage

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
