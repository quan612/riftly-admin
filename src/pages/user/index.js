import React from 'react'
import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import AdminLayout from '@components/admin/AdminLayout'
import UsersProvider from '@context/UsersContext'

const AdminUsersComponent = dynamic(() => import('@components/admin/user/list/AdminUsers'))

const AdminSearchUsersPage = () => {
  return (
    <UsersProvider>
      <AdminUsersComponent />
    </UsersProvider>
  )
}

AdminSearchUsersPage.Layout = AdminLayout
AdminSearchUsersPage.requireAdmin = true
export default AdminSearchUsersPage

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
