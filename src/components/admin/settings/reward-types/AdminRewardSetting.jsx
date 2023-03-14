import React, { useState } from 'react'

import { useAdminRewardTypeMutation, useRewardTypesQuery } from '@hooks/admin/reward-types'

import AddRewardType from './AddRewardType'
import RewardTypes from './RewardTypes'
import HalfPageWrapper from '@components/admin/layout/HalfPageWrapper'

const AdminRewardSetting = () => {
  const [data, isUpserting, upsertRewardTypeAsync] = useAdminRewardTypeMutation()
  const [createRewardType, createRewardTypeSet] = useState({
    id: -1,
    reward: '',
    rewardPreview: '',
    // rewardIcon: '',
    isUpdating: false,
    isEnabled: true,
  })
  return (
    <HalfPageWrapper>
      <AddRewardType
        upsertRewardTypeAsync={upsertRewardTypeAsync}
        createRewardType={createRewardType}
        createRewardTypeSet={createRewardTypeSet}
      />
      <RewardTypes createRewardTypeSet={createRewardTypeSet} />
    </HalfPageWrapper>
  )
}

export default AdminRewardSetting
