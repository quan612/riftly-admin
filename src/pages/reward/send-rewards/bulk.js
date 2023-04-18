import React from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

import dynamic from 'next/dynamic'
const BulkRewardToUserComponent = dynamic(() => import('@components/admin/reward/send-rewards/BulkRewardsUsers'))

const AdminBulkRewards = () => {
  return <BulkRewardToUserComponent />
}

AdminBulkRewards.Layout = AdminLayout
AdminBulkRewards.requireAdmin = true
export default AdminBulkRewards


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
