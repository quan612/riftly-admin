import React, { useState, useEffect, useCallback } from 'react'
import Enums from '@enums/index'
import { useEnabledRewardTypesQuery } from '@hooks/admin/reward-types'
import axios from 'axios'
import { useAdminQuestsQuery } from '@hooks/admin/quest'

export const AdminQuestFormContext = React.createContext()

const AdminQuestFormProvider = ({ questTypes, id = null, children }) => {
  const [questType, questTypeSelect] = useState(null)
  const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery()
  const { data: quests, isLoading: isLoadingQuests } = useAdminQuestsQuery()

  const [selectedQuest, selectedQuestSet] = useState(null)

  useEffect(() => {
    if (questTypes?.length > 0) {
      questTypeSelect(questTypes[0]?.name)
    }
  }, [])

  useEffect(() => {
    if (id && quests) {
      let selectQuest = quests?.filter((q) => parseInt(q.id) === parseInt(id))
      selectedQuestSet(selectQuest[0])
      questTypeSelect(selectQuest[0].type?.name)
    }
  }, [quests, id])
  return (
    <AdminQuestFormContext.Provider
      value={{
        questType,
        questTypeSelect,
        questTypes,

        selectedQuest,
        isLoadingQuests,
        rewardTypes,
        isLoadingRewardTypes,
      }}
    >
      {children}
    </AdminQuestFormContext.Provider>
  )
}

export default AdminQuestFormProvider
