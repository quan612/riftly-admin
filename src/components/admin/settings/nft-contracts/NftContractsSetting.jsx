import React, { useState } from 'react'
import AddNftContract from './AddNftContract'
import NftContractList from './NftContractsList'
import HalfPageWrapper from '@components/admin/layout/HalfPageWrapper'

const NftContractsSetting = () => {
  const [createData, createDataSet] = useState({
    id: -1,
    name: '',
    address: '',
    chain: '',
    isUpdating: false,
  })
  return (
    <HalfPageWrapper>
      <NftContractList createDataSet={createDataSet} />
      <AddNftContract createData={createData} createDataSet={createDataSet} />
    </HalfPageWrapper>
  )
}

export default NftContractsSetting
