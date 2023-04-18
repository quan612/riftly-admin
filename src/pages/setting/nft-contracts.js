import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'

import dynamic from 'next/dynamic'
const AdminNFTContractsComponent = dynamic(() =>
  import('@components/admin/settings/nft-contracts/NftContractsSetting'),
)

const AdminNFTContractsPage = () => {
  return <AdminNFTContractsComponent />
}

AdminNFTContractsPage.Layout = AdminLayout
AdminNFTContractsPage.requireAdmin = true
export default AdminNFTContractsPage

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
