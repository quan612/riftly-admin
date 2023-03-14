import React from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
const AdminImageHostingSettingComponent = dynamic(() =>
  import('@components/admin/settings/image-hosting/AdminImageHostingSetting'),
)

const AdminImageHostingSettingPage = () => {
  return <AdminImageHostingSettingComponent />
}

AdminImageHostingSettingPage.Layout = AdminLayout
AdminImageHostingSettingPage.requireAdmin = true
export default AdminImageHostingSettingPage

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
