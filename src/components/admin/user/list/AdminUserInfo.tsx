import React from 'react'

import { Flex, Text, FormControl, FormLabel, Icon, useToast, Avatar } from '@chakra-ui/react'

import { FaCopy, FaDownload, FaFileCsv } from 'react-icons/fa'

import { shortenAddress } from '@util/index'
import { useCopyToClipboard } from 'usehooks-ts'
import moment from 'moment'
import { WhiteListAggregate } from 'types/common'

interface UsersBannerProps {
  userDetails?: WhiteListAggregate
}

const AdminUserInfo = ({ userDetails }: UsersBannerProps) => {
  const {
    userId,
    avatar,
    discordUserDiscriminator,
    email,
    twitterUserName,
    wallet,
    // google,
    userQuest,
    createdAt,
  } = userDetails
  const [value, copy] = useCopyToClipboard()
  const toast = useToast()

  const questCompleted = userQuest?.filter((q) => q?.hasClaimed)
  return (
    <Flex direction={'column'} gap="1rem">
      <Avatar size="lg" src={avatar}></Avatar>
      <FormControl gap="8px">
        <FormLabel fontSize="sm" fontWeight="200" mb="2px">
          Member since
        </FormLabel>
        <Text fontWeight="400">{moment(createdAt).format('MM-DD-YYYY')}</Text>
      </FormControl>
      
        <FormControl gap="8px">
          <FormLabel fontSize="sm" fontWeight="200" mb="2px">
            Wallet
          </FormLabel>
          {wallet && wallet?.length > 0 && (    <Flex gap="1rem">
            <Text isTruncated maxW="80%">
              {shortenAddress(wallet)}
            </Text>
            <Icon
              transition="0.8s"
              color="blue.300"
              boxSize={6}
              as={FaCopy}
              _hover={{
                cursor: 'pointer',
              }}
              onClick={() => {
                if (wallet?.length > 16) {
                  copy(wallet)
                  toast({
                    description: `Copied wallet ${wallet}`,
                    position: 'bottom-right',

                    duration: 2000,
                  })
                }
              }}
            />
          </Flex>
            )}
        </FormControl>
    

      {discordUserDiscriminator && discordUserDiscriminator.length > 0 && (
        <FormControl gap="8px">
          <FormLabel fontSize="sm" fontWeight="200" mb="2px">
            Discord
          </FormLabel>
          <Flex>
            <Text isTruncated maxW="80%">
              {discordUserDiscriminator}
            </Text>
          </Flex>
        </FormControl>
      )}

      {twitterUserName && twitterUserName.length > 0 && (
        <FormControl gap="8px">
          <FormLabel fontSize="sm" fontWeight="200" mb="2px">
            Twitter
          </FormLabel>
          <Flex>
            <Text isTruncated maxW="80%">
              {twitterUserName}
            </Text>
          </Flex>
        </FormControl>
      )}

      {email && email.length > 0 && (
        <FormControl gap="8px">
          <FormLabel fontSize="sm" fontWeight="200" mb="2px">
            Email
          </FormLabel>
          <Flex>
            <Text isTruncated maxW="80%">
              {email}
            </Text>
          </Flex>
        </FormControl>
      )}

    

      <FormControl gap="8px">
        <FormLabel fontSize="sm" fontWeight="200" mb="2px">
          Challenges Completed
        </FormLabel>
        <Text fontWeight="400">{questCompleted.length}</Text>
      </FormControl>
    </Flex>
  )
}

export default AdminUserInfo
