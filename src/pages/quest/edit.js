import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
// const CurrentQuestsComponent = dynamic(() => import('@components/admin/quest/CurrentQuests'))
import { useRouter } from 'next/router'

import AdminQuestFormProvider from '@context/AdminQuestFormContext'
import { useAdminQuestTypesQuery } from '@hooks/admin/quest'


import EditQuest from '@components/admin/quest/EditQuest'

const AdminEditQuest = () => {
  const router = useRouter()
  const { data: allQuestTypes, isLoading: isLoadingQuestTypes } = useAdminQuestTypesQuery()
  const { query: { id } } = router;

  return (
    <AdminQuestFormProvider questTypes={allQuestTypes} id={id} >
      <EditQuest />
    </AdminQuestFormProvider>
  )
}

AdminEditQuest.Layout = AdminLayout
AdminEditQuest.requireAdmin = true
export default AdminEditQuest

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
