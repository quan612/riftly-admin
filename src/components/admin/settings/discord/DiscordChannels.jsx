import React, { useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import {
  useAdminDiscordChannelsMutation,
  useAdminDiscordChannelsQuery,
} from '@hooks/admin/settings'

import { Heading, Box, Flex, Table, Tbody, Th, Thead, Tr, Td, Switch } from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { RiftlyTooltip } from '@components/shared/Icons'
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

  const handleOnPostMessageChange = async (e, discord) => {
    e.preventDefault()

    let val = e.target.checked
    if (discord.postMessageWhenClaimed !== val) {
      const payload = {
        ...discord,
        postMessageWhenClaimed: val,
        isCreated: false,
      }

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

  const debouncedIsPostMessageChangeHandler = useCallback(
    (val, discord) => debounce(handleOnPostMessageChange(val, discord), 800),
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
            <Th px="0.25rem">
              Status
              {/* <RiftlyTooltip label="Disabled Channel will not be listed under Reward User Page" /> */}
            </Th>
            <Th>
              Post Message
              {/* <RiftlyTooltip label="Allow to post an embeded message to this channel once user claimed a reward" /> */}
            </Th>
            {/* <Th px="0.25rem">Action</Th> */}
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
                  <Td px="0.25rem">
                    <Switch
                      id="post-discord-channel-message"
                      defaultChecked={discord?.postMessageWhenClaimed ? true : false}
                      onChange={(e) => debouncedIsPostMessageChangeHandler(e, discord)}
                    />
                  </Td>
                  {/*  <Td px="0.25rem">
                   <Icon                       
                        transition="0.8s"
                        color="red.300"
                        boxSize={7}
                        as={AiFillDelete}
                        _hover={{
                            cursor: "pointer",
                            color: "red.600",
                        }}
                        onClick={async () => {
                            // if (
                            //     !window.confirm(
                            //         "Proceed to soft delete discord channel "
                            //     )
                            // ) {
                            //     return;
                            // }
                            // handleQuestSoftDelete(quest);
                        }}
                      /> 
                  </Td>*/}
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </AdminCard>
  )
}

export default DiscordChannels
