import React from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AddRewardToUserComponent = dynamic(() => import('@components/admin/reward/AddRewardToUser'))

const AdminRewards = () => {
  return <AddRewardToUserComponent />
}

AdminRewards.Layout = AdminLayout
AdminRewards.requireAdmin = true
export default AdminRewards

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
