import React, { useEffect, useState } from 'react'
import AdminLayout from '@components/admin/AdminLayout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useRouter } from 'next/router'
import AddQuest from '@components/admin/quest/AddQuest'
import AdminQuestFormProvider from '@context/AdminQuestFormContext'
import { useAdminQuestTypesQuery } from '@hooks/admin/quest'

import Loading from '@components/shared/LoadingContainer/Loading'

import Enums, {
  CATEGORY_AUTHENTICATION,
  CATEGORY_COMMUNITY_ENGAGEMENT,
  CATEGORY_PARTNERSHIP,
  CATEGORY_REWARD_POINTS,
  CATEGORY_SOCIAL_FOLLOW,
  CATEGORY_SOCIAL_SHARE,
  DISCORD_AUTH,
  TWITTER_AUTH,
  WALLET_AUTH,
  FOLLOW_TWITTER,
  FOLLOW_INSTAGRAM,
  TWITTER_RETWEET
} from '@enums/index'

const AdminAddQuest = ({ session }) => {
  const router = useRouter()
  const { data: allQuestTypes, isLoading: isLoadingQuestTypes } = useAdminQuestTypesQuery()
  const [questTypes, questTypesSet] = useState()
  const { query: { type } } = router

  useEffect(() => {
    if (type && allQuestTypes) {
      let questTypesFilter
      switch (type) {
        case CATEGORY_AUTHENTICATION.type:
          questTypesFilter = allQuestTypes.filter(
            (q) =>
              q.name === DISCORD_AUTH ||
              q.name === TWITTER_AUTH ||
              q.name === WALLET_AUTH,
          )
          break

        case CATEGORY_SOCIAL_FOLLOW.type:
          questTypesFilter = allQuestTypes.filter(
            (q) => q.name === FOLLOW_TWITTER || q.name === FOLLOW_INSTAGRAM,
          )

          break
        case CATEGORY_SOCIAL_SHARE.type:
          questTypesFilter = allQuestTypes.filter((q) => q.name === TWITTER_RETWEET)

          break
        case CATEGORY_REWARD_POINTS.type:
          questTypesFilter = allQuestTypes.filter(
            (q) =>
              q.name === Enums.DAILY_SHELL ||
              q.name === Enums.LIMITED_FREE_SHELL ||
              q.name === Enums.OWNING_NFT_CLAIM,
          )

          break
        case CATEGORY_PARTNERSHIP.type:
          questTypesFilter = allQuestTypes.filter((q) => q.name === Enums.UNSTOPPABLE_AUTH)

          break
        case CATEGORY_COMMUNITY_ENGAGEMENT.type:
          questTypesFilter = allQuestTypes.filter(
            (q) => q.name === Enums.CODE_QUEST
          )

          break
        default:
          questTypesFilter = []
      }

      questTypesSet(questTypesFilter)
    }
  }, [type, allQuestTypes])

  if (!questTypes) {
    return <Loading />
  }
  return (
    <AdminQuestFormProvider questTypes={questTypes}>
      <AddQuest />
    </AdminQuestFormProvider>
  )
}

AdminAddQuest.Layout = AdminLayout
AdminAddQuest.requireAdmin = true
export default AdminAddQuest

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
