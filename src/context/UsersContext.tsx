import React, { useState, useEffect, useCallback } from 'react'
import { useAdminUserStatsQuery } from '@hooks/admin/user'
import { useDisclosure } from '@chakra-ui/react'
import Enums from '@enums/index'
import type Prisma from '@prisma/client'
import { getNftOwners } from '@components/admin/user/list/helper'
import { RewardFilterType, WhiteListAggregate } from 'types/common'

type UsersFilterType = {
  type: string
  nftData: string
  user: string
  rewards?: RewardFilterType[]
}

type UsersContextType = {
  isLoadingUserStats: boolean
  allUsers: Prisma.WhiteList[] | null
  filterUsers: Prisma.WhiteList[] | null
  filterSidebar: any
  userSidebar: any
  filterObj: UsersFilterType
  filterObjSet: any
  resetFilter: () => void
  viewUserDetails: (user: Prisma.WhiteList) => void
  userDetails: WhiteListAggregate
}

export const UsersContext = React.createContext<UsersContextType | null>(null)

const UsersProvider: React.FC<React.ReactNode> = ({ children }) => {
  const { data: allUsers, isLoading: isLoadingUserStats } = useAdminUserStatsQuery()
  const [filterUsers, filterUsersSet] = useState(null)
  const [userDetails, userDetailsSet] = useState(null)

  const [filterObj, filterObjSet] = useState({
    type: Enums.WALLET,
    nftData: '',
    user: '',
    rewards: [],
  })

  const resetFilter = useCallback(() => {
    filterObjSet({
      type: Enums.WALLET,
      nftData: '',
      user: '',
      rewards: [],
    })
  }, [filterObj])

  const filterSidebar = useDisclosure()
  const userSidebar = useDisclosure()

  useEffect(() => {
    const filterUsers = async () => {
      if (allUsers) {
        try {
          let filterResult = [...(allUsers as WhiteListAggregate[])]
          const { nftData, user, rewards, type } = filterObj
          if (nftData?.length > 0) {

            filterResult = filterResult.filter((w) => nftData.includes(w.wallet))
          }
          if (user?.trim().length > 0) {

            switch (type) {
              case Enums.WALLET:
                filterResult = filterResult.filter((w) => w.wallet === user)
                break
              case Enums.TWITTER:
                filterResult = filterResult.filter(
                  (w) => w.twitterUserName?.toLowerCase().indexOf(user.toLowerCase()) >= 0,
                )
                break
              case Enums.DISCORD:
                filterResult = filterResult.filter(
                  (w) => w.discordUserDiscriminator?.toLowerCase().indexOf(user.toLowerCase()) >= 0,
                )
                break
              case Enums.EMAIL:
                filterResult = filterResult.filter((w) => w.email?.indexOf(user) >= 0)
                break
              default:
            }
          }
          if (rewards.length > 0) {
            for (const rewardFilter of rewards) {
              if (rewardFilter?.minQty > 0) {
                filterResult = filterResult.filter((row) => {
                  const rewardIndex = row.rewards.findIndex(
                    (userReward) => userReward.rewardTypeId === rewardFilter.id,
                  )
                  if (rewardIndex === -1) {
                    return false
                  }
                  if (
                    row.rewards[rewardIndex].quantity < rewardFilter.minQty ||
                    row.rewards[rewardIndex].quantity > rewardFilter.maxQty
                  ) {
                    return false
                  }

                  return true
                })
              }
            }
          }

          filterUsersSet(filterResult)
        } catch (error) {
          console.log(error)
        }
      }
    }
    filterUsers()
  }, [allUsers, filterObj])

  const viewUserDetails = useCallback((user) => {
    userDetailsSet(user)
    userSidebar.onOpen()
  }, [])

  return (
    <UsersContext.Provider
      value={{
        isLoadingUserStats,
        allUsers,
        filterUsers,
        filterSidebar,
        userSidebar,
        filterObj,
        filterObjSet,
        resetFilter,
        viewUserDetails,
        userDetails,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export default UsersProvider
