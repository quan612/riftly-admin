import React from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import RewardMethodView from '@components/admin/reward/View'

const AdminRewardPage = () => {
  return <RewardMethodView />
}

AdminRewardPage.Layout = AdminLayout
AdminRewardPage.requireAdmin = true
export default AdminRewardPage

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
