import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
import SettingsView from '@components/admin/settings/View'
// const CurrentQuestsComponent = dynamic(() => import('@components/admin/quest/CurrentQuests'))

const AdminSettings = () => {

  return <SettingsView />
}

AdminSettings.Layout = AdminLayout
AdminSettings.requireAdmin = true
export default AdminSettings

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
