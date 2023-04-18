import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'

import dynamic from 'next/dynamic'
const AdminRewardSettingComponent = dynamic(() =>
  import('@components/admin/reward/reward-types/AdminRewardSetting'),
)

const AdminRewardSettingPage = ({ session }) => {
  return <AdminRewardSettingComponent />
}

AdminRewardSettingPage.Layout = AdminLayout
AdminRewardSettingPage.requireAdmin = true
export default AdminRewardSettingPage

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
