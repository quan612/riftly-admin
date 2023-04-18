import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import Enums from 'enums'

import { Heading, Box, Flex, Text, Icon, Grid } from '@chakra-ui/react'
import { AdminBanner, AdminCard } from '@components/shared/Card'

import { HeadingLg, TextMd } from '@components/shared/Typography'
import { useRouter } from 'next/router'
import {
  DiscordSettingIcon,
  RewardsSettingIcon,
  TwitterSettingIcon,
} from '@components/shared/Icons'

const RewardsView = () => {
  const router = useRouter()
  return (
    <Flex
      w={{ base: '100%' }}
      maxW="container.md"
      flexDirection="column"
      gap="20px"
      mb="24px"
      className="create-new-quest-container"
    >
      <Box w="100%" mb="2rem">
        <AdminCard p="16px">
          <Flex direction="column" gap="16px">
            <Flex direction="column" gap="20px">
              <HeadingLg>Manage Rewards</HeadingLg>
              <TextMd color="brand.neutral2">
                {`Manage ways of reward distribution and reward types in this section. You must create Reward Types before rewarding users.`}
              </TextMd>
            </Flex>

            <Flex direction="column" gap="16px">
              {methodList.map((setting, index) => {
                return (
                  <Box
                    className="quest-box"
                    position="relative"
                    key={index}
                    onClick={() => {
                      let path = setting.path
                      router.push(path)
                    }}
                    color="brand.neutral3"
                    _hover={{
                      cursor: 'pointer',
                      color: '#00BBC7',
                      transition: '0.6s',
                    }}
                  >
                    <SettingBoxSVG setting={setting} />
                  </Box>
                )
              })}
            </Flex>
          </Flex>
        </AdminCard>
      </Box>
    </Flex>
  )
}

export default RewardsView

const SettingBoxSVG = ({ setting }) => {
  const { icon, title, description } = setting
  return (
    <>
      <Grid
        className="grid-setting-box"
        templateColumns="1fr 5fr"
        position="absolute"
        w="100%"
        h="100%"
        border="1px solid"
        borderRadius={'24px'}
        borderColor="currentColor"
      >
        <Flex w="100%" justify="center" align="center">
          <Flex w="50%">{icon}</Flex>
        </Flex>

        <Flex direction="column" justify="center" h="100%">
          <Heading size="20px" color="white" w="100%">
            {title}
          </Heading>
          <Text color="brand.neutral1" fontSize={{ base: '12px', sm: '16px', lg: '16px' }}>
            {description}
          </Text>
        </Flex>
      </Grid>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 711 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="711" height="108" rx="20" fill="#2F4E6D" />
        <g clipPath="url(#clip0_481_2561)">
          <path
            d="M672.334 54L667 48.6679L669.666 46L677.666 54L669.666 62L667 59.3321L672.334 54Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_481_2561">
            <rect
              stroke="currentColor"
              width="18"
              height="18"
              fill="white"
              transform="translate(663 45)"
            />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}

const methodList = [
  {
    title: 'Send Rewards',
    description: 'Reward individual or bulk rewards',
    icon: <DiscordSettingIcon />,
    path: '/reward/send-rewards',
  },
  {
    title: 'Shop Items',
    description: 'Add, Remove, or edit redeemable items in the points shop',
    icon: <DiscordSettingIcon />,
    path: '/reward/shop',
  },

  {
    title: 'Configure Reward Types',
    description: 'Add, remove, or edit Reward Types',
    icon: <RewardsSettingIcon />,
    path: '/reward/config',
  },
]
