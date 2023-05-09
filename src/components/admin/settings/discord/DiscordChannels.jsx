import React, { useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import {
  useAdminDiscordChannelsMutation,
  useAdminDiscordChannelsQuery,
} from '@hooks/admin/settings'

import { Heading, Box, Flex, Table, Tbody, Th, Thead, Tr, Td, Switch } from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { debounce } from '@util/index'

const DiscordChannels = () => {
  const [discordChannels, isLoadingDiscordChannels] = useAdminDiscordChannelsQuery()
  const [data, isUpserting, upsertChannelAsync] = useAdminDiscordChannelsMutation()
  const toast = useToast()

  const handleOnStatusChange = async (e, discord) => {
    e.preventDefault()
    if (discord.isEnabled !== e.target.checked) {
      const payload = { ...discord, isEnabled: e.target.checked, isCreated: false }
      const res = await upsertChannelAsync(payload)
      if (!res?.isError) {
        toast({
          title: 'Success',
          description: `Mutate discord channel ${discord.channel} success`,
          position: 'bottom-right',
          status: 'success',
          duration: 2000,
        })
      }
    }
  }

  const debouncedStatusChangeHandler = useCallback(
    (e, discord) => debounce(handleOnStatusChange(e, discord), 800),
    [],
  )

  return (
    <AdminCard>
      <Heading color="#fff" size="md">
        Current Channels
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr my=".8rem" pl="0px" color="gray.400" fontSize="18px">
            <Th px="0.25rem">Channel</Th>
            <Th px="0.25rem">Channel Id</Th>
            <Th px="0.25rem">Status</Th>
            <Th>Post Message</Th>
          </Tr>
        </Thead>
        <Tbody>
          {discordChannels &&
            discordChannels.map((discord, index) => {
              return (
                <Tr key={index}>
                  <Td px="0.25rem">{discord.channel}</Td>
                  <Td px="0.25rem">{discord.channelId}</Td>
                  <Td px="0.25rem">
                    <Switch
                      id="-discord-channel-status"
                      defaultChecked={discord?.isEnabled ? true : false}
                      onChange={(e) => debouncedStatusChangeHandler(e, discord)}
                    />
                  </Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </AdminCard>
  )
}

export default DiscordChannels
