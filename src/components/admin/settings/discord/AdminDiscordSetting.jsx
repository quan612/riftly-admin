import React from 'react'
import AddChannel from './AddChannel'
import DiscordChannels from './DiscordChannels'
import DiscordBotInfo from './DiscordBotInfo'
import HalfPageWrapper from '@components/admin/layout/HalfPageWrapper'

const AdminDiscordSetting = () => {
  return (
    <HalfPageWrapper>
      <DiscordBotInfo />
      <DiscordChannels />
      <AddChannel />
    </HalfPageWrapper>
  )
}

export default AdminDiscordSetting
