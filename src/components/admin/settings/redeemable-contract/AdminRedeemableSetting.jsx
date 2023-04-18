import React, { useState } from 'react'

import HalfPageWrapper from '@components/admin/layout/HalfPageWrapper'
import { useAdminRedeemableContractMutation } from '@hooks/admin/redeemable-contract'
import RedeemContractList from './RedeemContractList'
import AddRedeemableContract from './AddRedeemableContract'

const AdminRedeemableSetting = () => {
  const [data, isUpserting, upsertRedeemableContractAsync] = useAdminRedeemableContractMutation()
  const [createRedeemableContract, createRedeemableContractSet] = useState({
    id: -1,
    contract: '',
    maxRedeemable: 0,
    isCreate: true,
  })
  return (
    <HalfPageWrapper>
      <AddRedeemableContract
        upsertRedeemableContractAsync={upsertRedeemableContractAsync}
        createRedeemableContract={createRedeemableContract}
        createRedeemableContractSet={createRedeemableContractSet}
      />
      <RedeemContractList createRedeemableContractSet={createRedeemableContractSet} />
    </HalfPageWrapper>
  )
}

export default AdminRedeemableSetting
