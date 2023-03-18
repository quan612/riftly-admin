import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import Enums from 'enums'

import { Heading, Box, Flex, Text, Icon, Grid } from '@chakra-ui/react'
import { AdminBanner, AdminCard } from '@components/shared/Card'

import { HeadingLg, TextMd } from '@components/shared/Typography'
import { useRouter } from 'next/router'

const RewardMethodView = () => {
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
              <HeadingLg>Select Reward Method</HeadingLg>
              <TextMd color="brand.neutral2">
                {`Choose how would you like to reward the user(s)`}
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

export default RewardMethodView

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

const DiscordSettingIcon = () => {
  return (
    <Icon
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.1737 20.5714C21.5451 20.5714 22.656 21.6 22.6309 22.8571C22.6309 24.1143 21.5474 25.1429 20.1737 25.1429C18.8251 25.1429 17.7143 24.1143 17.7143 22.8571C17.7143 21.6 18.8 20.5714 20.1737 20.5714ZM28.9691 20.5714C30.3429 20.5714 31.4286 21.6 31.4286 22.8571C31.4286 24.1143 30.3429 25.1429 28.9691 25.1429C27.6206 25.1429 26.512 24.1143 26.512 22.8571C26.512 21.6 27.5954 20.5714 28.9691 20.5714ZM40.3223 0C42.9806 0 45.1429 2.208 45.1429 4.944V48L40.0891 43.44L37.2434 40.752L34.2331 37.8949L35.4811 42.336H8.82057C6.16229 42.336 4 40.128 4 37.392V4.944C4 2.208 6.16229 0 8.82057 0H40.32H40.3223ZM31.248 31.344C36.4434 31.1771 38.4434 27.696 38.4434 27.696C38.4434 19.968 35.056 13.7029 35.056 13.7029C31.6731 11.1131 28.4503 11.184 28.4503 11.184L28.1211 11.568C32.1189 12.816 33.9749 14.6171 33.9749 14.6171C31.7922 13.3874 29.3866 12.6042 26.8983 12.3131C25.3199 12.1349 23.7256 12.1502 22.1509 12.3589C22.0091 12.3589 21.8903 12.384 21.7509 12.4069C20.928 12.48 18.928 12.7909 16.4137 13.92C15.5451 14.3269 15.0263 14.6171 15.0263 14.6171C15.0263 14.6171 16.9783 12.72 21.2091 11.472L20.9737 11.184C20.9737 11.184 17.7531 11.1131 14.368 13.7051C14.368 13.7051 10.9829 19.968 10.9829 27.696C10.9829 27.696 12.9577 31.1749 18.1531 31.344C18.1531 31.344 19.0217 30.2651 19.7303 29.3531C16.7429 28.4389 15.616 26.5189 15.616 26.5189C15.616 26.5189 15.8491 26.688 16.272 26.928C16.2949 26.9509 16.3177 26.976 16.3657 26.9989C16.4366 27.0491 16.5074 27.072 16.5783 27.12C17.1657 27.456 17.7531 27.7189 18.2926 27.936C19.2571 28.32 20.4091 28.704 21.7509 28.9691C23.7607 29.3631 25.8272 29.3709 27.84 28.992C29.0124 28.7827 30.1562 28.4368 31.248 27.9611C32.0709 27.648 32.9874 27.1909 33.952 26.544C33.952 26.544 32.7771 28.512 29.696 29.4011C30.4023 30.3131 31.2503 31.344 31.2503 31.344H31.248Z"
        fill="#00BBC7"
      />
    </Icon>
  )
}

const TwitterSettingIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47.9645 8.62973C46.168 9.42437 44.2629 9.94626 42.3122 10.1781C44.3683 8.94842 45.9071 7.01314 46.642 4.73289C44.7124 5.88123 42.5969 6.68601 40.392 7.12135C38.9109 5.53668 36.9478 4.48572 34.8078 4.13186C32.6679 3.77799 30.4709 4.14105 28.5586 5.16459C26.6462 6.18812 25.1256 7.81479 24.2331 9.7917C23.3406 11.7686 23.1263 13.985 23.6234 16.0963C19.7103 15.9002 15.8823 14.8833 12.3877 13.1117C8.89316 11.3401 5.81025 8.85339 3.33914 5.81299C2.46444 7.31537 2.00479 9.02324 2.00725 10.7617C2.00725 14.1738 3.74388 17.1882 6.38413 18.953C4.82165 18.9039 3.29356 18.4819 1.92724 17.7223V17.8447C1.92771 20.1172 2.71406 22.3195 4.15297 24.0784C5.59188 25.8372 7.59478 27.0443 9.82209 27.495C8.37164 27.8881 6.85077 27.946 5.37462 27.6644C6.0026 29.6205 7.22657 31.3311 8.87516 32.5569C10.5238 33.7827 12.5144 34.4622 14.5684 34.5004C12.527 36.1036 10.1896 37.2888 7.68985 37.9882C5.19009 38.6875 2.57701 38.8873 0 38.576C4.49853 41.4691 9.73525 43.005 15.0838 43C33.1866 43 43.0864 28.0033 43.0864 14.9974C43.0864 14.5738 43.0746 14.1455 43.0558 13.7267C44.9827 12.334 46.6458 10.6088 47.9668 8.63208L47.9645 8.62973Z"
        fill="#00BBC7"
      />
    </svg>
  )
}

const methodList = [
  {
    title: 'Single Reward',
    description: 'Reward single user by wallet, discord or twitter handle',
    icon: <DiscordSettingIcon />,
    path: '/reward/single',
  },
  {
    title: 'Bulk Reward',
    description: 'Reward multiple users by uploading .csv of wallet addresses',
    icon: <TwitterSettingIcon />,
    path: '/reward/bulk',
  },
]
