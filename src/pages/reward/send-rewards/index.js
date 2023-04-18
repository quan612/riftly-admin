import React from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import SendRewardsView from '@components/admin/reward/send-rewards/View'

const AdminSendRewardsPage = () => {
  return <SendRewardsView />
}

AdminSendRewardsPage.Layout = AdminLayout
AdminSendRewardsPage.requireAdmin = true
export default AdminSendRewardsPage

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
