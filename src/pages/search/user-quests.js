import React from 'react'
import AdminLayout from '@components/admin/AdminLayout'

import dynamic from 'next/dynamic'
const AdminUserQuestsSearchComponent = dynamic(() =>
  import('@components/admin/user/user-quests/AdminUserQuestsSearch'),
)

const AdminSearchUserQuestPage = () => {
  return <AdminUserQuestsSearchComponent />
}

AdminSearchUserQuestPage.Layout = AdminLayout
AdminSearchUserQuestPage.requireAdmin = true
export default AdminSearchUserQuestPage

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
