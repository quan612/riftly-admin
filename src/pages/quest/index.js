import React from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
const CurrentQuestsComponent = dynamic(() => import('@components/admin/quest/List/CurrentQuests'))

const AdminQuest = () => {
  return <CurrentQuestsComponent />
}

AdminQuest.Layout = AdminLayout
AdminQuest.requireAdmin = true
export default AdminQuest

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
