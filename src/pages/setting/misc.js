import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AdminMiscSettingComponent = dynamic(() =>
  import('@components/admin/settings/misc/AdminMiscSetting'),
)

const AdminDiscordSettingPage = () => {
  return <AdminMiscSettingComponent />
}

AdminDiscordSettingPage.Layout = AdminLayout
AdminDiscordSettingPage.requireAdmin = true
export default AdminDiscordSettingPage

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
