import React, { useContext } from 'react'
import Enums from 'enums'
import { Input } from '@chakra-ui/react'
import { AdminQuestFormContext } from '@context/AdminQuestFormContext'

import JoinDiscordQuestForm from './TemplateForms/JoinDiscordQuestForm'
import OwnNftQuestForm from './TemplateForms/OwnNftQuestForm'
import EnterCodeQuestForm from './TemplateForms/EnterCodeQuestForm'
import DailyQuestForm from './TemplateForms/DailyQuestForm'
import DiscordAuthQuestForm from './TemplateForms/DiscordAuthQuestForm'
import FreeLimitedQuestForm from './TemplateForms/FreeLimitedQuestForm'
import ImageUploadQuestForm from './TemplateForms/ImageUploadQuestForm'
import InstagramFollowQuestForm from './TemplateForms/InstagramFollowQuestForm'
import TwitterAuthQuestForm from './TemplateForms/TwitterAuthQuestForm'
import TwitterFollowQuestForm from './TemplateForms/TwitterFollowQuestForm'
import TwitterRetweetQuestForm from './TemplateForms/TwitterRetweetQuestForm'
import UnstoppableQuestForm from './TemplateForms/UnstoppableQuestForm'
import WalletAuthQuestForm from './TemplateForms/WalletAuthQuestForm'
import Loading from '@components/shared/LoadingContainer/Loading'

const customDateInput = ({ value, onClick, onChange }, ref) => (
  <Input
    variant="riftly"
    autoComplete="off"
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
  />
)

export default function EditQuest() {
  const { isLoadingQuests, selectedQuest } = useContext(AdminQuestFormContext)

  let questProps = {
    quest: selectedQuest,
    isCreate: false,
  }

  if (isLoadingQuests || !selectedQuest) {
    return <Loading />
  }

  if (selectedQuest && selectedQuest?.type?.name)
    return (
      <>
        {selectedQuest?.type?.name === Enums.DAILY_QUEST && (
          <DailyQuestForm quest={selectedQuest} isCreate={false} />
        )}

        {selectedQuest.type.name === Enums.DISCORD_AUTH && <DiscordAuthQuestForm {...questProps} />}
        {selectedQuest.type.name === Enums.CODE_QUEST && <EnterCodeQuestForm {...questProps} />}
        {selectedQuest.type.name === Enums.LIMITED_FREE_POINT && (
          <FreeLimitedQuestForm {...questProps} />
        )}
        {selectedQuest.type.name === Enums.IMAGE_UPLOAD_QUEST && (
          <ImageUploadQuestForm {...questProps} />
        )}

        {selectedQuest.type.name === Enums.FOLLOW_INSTAGRAM && (
          <InstagramFollowQuestForm {...questProps} />
        )}
        {selectedQuest.type.name === Enums.JOIN_DISCORD && <JoinDiscordQuestForm {...questProps} />}
        {selectedQuest.type.name === Enums.OWNING_NFT_CLAIM && <OwnNftQuestForm {...questProps} />}

        {selectedQuest.type.name === Enums.TWITTER_AUTH && <TwitterAuthQuestForm {...questProps} />}
        {selectedQuest.type.name === Enums.FOLLOW_TWITTER && (
          <TwitterFollowQuestForm {...questProps} />
        )}
        {selectedQuest.type.name === Enums.TWITTER_RETWEET && (
          <TwitterRetweetQuestForm {...questProps} />
        )}

        {selectedQuest.type.name === Enums.UNSTOPPABLE_AUTH && (
          <UnstoppableQuestForm {...questProps} />
        )}
        {selectedQuest.type.name === Enums.WALLET_AUTH && <WalletAuthQuestForm {...questProps} />}
      </>
    )
}
