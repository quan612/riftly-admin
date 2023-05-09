import React, { useEffect, useState, useCallback } from 'react'
import {
  Heading,
  Text,
  Button,
  Flex,
  Image,
  Input,
  SimpleGrid,
  Grid,
  GridItem,
  Box,
  ButtonGroup,
} from '@chakra-ui/react'

import ScrollableModalWrapper from '@components/shared/Modal/ScrollableModalWrapper'

import {
  CATEGORY_AUTHENTICATION,
  CATEGORY_COMMUNITY_ENGAGEMENT,
  CATEGORY_PARTNERSHIP,
  CATEGORY_REWARD_POINTS,
  CATEGORY_SOCIAL_FOLLOW,
  CATEGORY_SOCIAL_SHARE,
} from '@enums/index'

import { useRouter } from 'next/router'

const NewQuestModal = ({ isOpen, onClose }) => {
  const [select, selectSet] = useState('')
  const router = useRouter()

  const handleOnClose = () => {
    selectSet('')
    onClose()
  }

  const handleGoToNextStep = useCallback((select) => {
    switch (select) {
      case CATEGORY_AUTHENTICATION.title:
        router.push(`/quest/add?type=${CATEGORY_AUTHENTICATION.type}`)
        break
      case CATEGORY_COMMUNITY_ENGAGEMENT.title:
        router.push(`/quest/add?type=${CATEGORY_COMMUNITY_ENGAGEMENT.type}`)
        break
      case CATEGORY_PARTNERSHIP.title:
        router.push(`/quest/add?type=${CATEGORY_PARTNERSHIP.type}`)
        break
      case CATEGORY_REWARD_POINTS.title:
        router.push(`/quest/add?type=${CATEGORY_REWARD_POINTS.type}`)
        break
      case CATEGORY_SOCIAL_FOLLOW.title:
        router.push(`/quest/add?type=${CATEGORY_SOCIAL_FOLLOW.type}`)
        break
      case CATEGORY_SOCIAL_SHARE.title:
        router.push(`/quest/add?type=${CATEGORY_SOCIAL_SHARE.type}`)
        break
    }
  }, [])
  return (
    <ScrollableModalWrapper
      gap="24px"
      isOpen={isOpen}
      onClose={onClose}
      handleOnClose={handleOnClose}
      header={
        <Flex direction="column" w="100%">
          <Heading color="white" fontSize={{ base: 'lg', lg: '24px' }} lineHeight="4xl">
            Select Quest Category
          </Heading>

          <Text color="brand.neutral1" fontSize={{ base: 'sm', lg: 'md' }}>
            Choose from the below categories to create a new challenge to engage your users!
          </Text>
        </Flex>
      }
      footer={
        <ButtonGroup
          display={'flex'}
          justifyContent={'center'}
          alignItems="center"
          w={{ base: '100%' }}
          gap="24px"
        >
          <Button
            minW="150px"
            maxW="191px"
            variant="outline"
            onClick={handleOnClose}
            w="100%"
            borderRadius="24px"
          >
            Go Back
          </Button>

          <Button
            minW="150px"
            maxW="191px"
            variant="cyan"
            onClick={() => handleGoToNextStep(select)}
            disabled={select === ''}
            w="100%"
            borderRadius="24px"
          >
            Next Step
          </Button>
        </ButtonGroup>
      }
      showCloseButton={false}
    >
      <SimpleGrid columns={{ base: 2 }} gap="1rem" w="100%">
        {categories.map((category, index) => {
          return (
            <GridItem
              colSpan={{ base: 2, '2sm': 1 }}
              key={index}
              color={`${category?.title === select ? '#00BBC7' : 'brand.neutral3'}`}
              _hover={{
                cursor: 'pointer',
                color: '#00BBC7',
                transition: '0.6s',
              }}
              onClick={() => selectSet(category?.title)}
            >
              <Box className="quest-box" position="relative">
                <QuestCategoryWrapper category={category} />
              </Box>
            </GridItem>
          )
        })}
      </SimpleGrid>
    </ScrollableModalWrapper>
  )
}

export default NewQuestModal

const QuestCategoryWrapper = ({ category }) => {
  const { title, description, icon } = category

  return (
    <>
      <Grid templateColumns="1fr 3fr" position="absolute" w="100%" h="100%">
        <Flex w="100%" justify="center" align="center">
          <Flex w="50%">{icon}</Flex>
        </Flex>

        <Flex direction="column" justify="center">
          <Heading size="20px" color="white" w="100%">
            {title}
          </Heading>
          <Text color="brand.neutral1" fontSize={{ base: '12px', sm: '16px', lg: '16px' }}>
            {description}
          </Text>
        </Flex>
      </Grid>
      {/* hover outline */}
      <Box position="absolute" w="100%" h="100%">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 328 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" y="0.5" width="326.486" height="95" rx="19.5" stroke="currentColor" />
        </svg>
      </Box>
      {/* wrapper */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 328 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="327.486" height="96" rx="20" fill="#2F4E6D" />
      </svg>
    </>
  )
}

const KeySvgIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.6667 18.6667H16.8787C16.2496 20.4459 15.0118 21.9455 13.384 22.9004C11.7563 23.8552 9.84335 24.2039 7.98337 23.8848C6.12338 23.5657 4.43609 22.5993 3.21971 21.1564C2.00333 19.7136 1.33618 17.8872 1.33618 16C1.33618 14.1129 2.00333 12.2864 3.21971 10.8436C4.43609 9.40074 6.12338 8.43435 7.98337 8.11523C9.84335 7.7961 11.7563 8.14479 13.384 9.09967C15.0118 10.0545 16.2496 11.5541 16.8787 13.3333H30.6667V18.6667H28V24H22.6667V18.6667ZM9.33332 18.6667C10.0406 18.6667 10.7188 18.3857 11.2189 17.8856C11.719 17.3855 12 16.7073 12 16C12 15.2928 11.719 14.6145 11.2189 14.1144C10.7188 13.6143 10.0406 13.3333 9.33332 13.3333C8.62608 13.3333 7.9478 13.6143 7.4477 14.1144C6.94761 14.6145 6.66665 15.2928 6.66665 16C6.66665 16.7073 6.94761 17.3855 7.4477 17.8856C7.9478 18.3857 8.62608 18.6667 9.33332 18.6667Z"
        fill="#00BBC7"
      />
    </svg>
  )
}

const PointSvgIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 27 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.4856 16C26.4856 17.2617 25.6536 18.2857 24.6285 18.2857C19.499 18.2857 15.3427 23.4011 15.3427 29.7143C15.3427 30.976 14.5107 32 13.4856 32C12.4605 32 11.6285 30.976 11.6285 29.7143C11.6285 23.4011 7.47217 18.2857 2.34274 18.2857C1.3176 18.2857 0.485596 17.2617 0.485596 16C0.485596 14.7383 1.3176 13.7143 2.34274 13.7143C7.47217 13.7143 11.6285 8.59429 11.6285 2.28571C11.6285 1.024 12.4605 0 13.4856 0C14.5107 0 15.3427 1.024 15.3427 2.28571C15.3427 8.59429 19.499 13.7143 24.6285 13.7143C25.6536 13.7143 26.4856 14.7383 26.4856 16Z"
        fill="#00BBC7"
      />
    </svg>
  )
}

const SocialFollowIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.0001 29.3333C8.63608 29.3333 2.66675 23.364 2.66675 16C2.66675 8.63596 8.63608 2.66663 16.0001 2.66663C23.3641 2.66663 29.3334 8.63596 29.3334 16C29.3334 23.364 23.3641 29.3333 16.0001 29.3333ZM14.6667 14.6666H9.33341V17.3333H14.6667V22.6666H17.3334V17.3333H22.6667V14.6666H17.3334V9.33329H14.6667V14.6666Z"
        fill="#00BBC7"
      />
    </svg>
  )
}

const SocialShareIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.48551 5.33337H28.4855C28.8391 5.33337 29.1783 5.47385 29.4283 5.7239C29.6784 5.97395 29.8188 6.31309 29.8188 6.66671V16H27.1522V8.00004H8.48551V12L1.81885 6.66671L8.48551 1.33337V5.33337ZM24.4855 26.6667H4.48551C4.13189 26.6667 3.79275 26.5262 3.54271 26.2762C3.29266 26.0261 3.15218 25.687 3.15218 25.3334V16H5.81885V24H24.4855V20L31.1522 25.3334L24.4855 30.6667V26.6667Z"
        fill="#00BBC7"
      />
    </svg>
  )
}

const CommunityEngagementIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.0001 4C26.0507 4 29.3334 7.33333 29.3334 12C29.3334 21.3333 19.3334 26.6667 16.0001 28.6667C12.6667 26.6667 2.66675 21.3333 2.66675 12C2.66675 7.33333 6.00008 4 10.0001 4C12.4801 4 14.6667 5.33333 16.0001 6.66667C17.3334 5.33333 19.5201 4 22.0001 4Z"
        fill="#00BBC7"
      />
    </svg>
  )
}

const PartnershipIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9255 15.3333H15.8188C17.4101 15.3333 18.9363 15.9655 20.0615 17.0907C21.1867 18.2159 21.8188 19.742 21.8188 21.3333H12.4842L12.4855 22.6666H23.1522V21.3333C23.148 19.9146 22.7381 18.5267 21.9708 17.3333H25.8188C27.0792 17.333 28.3138 17.6899 29.3796 18.3627C30.4453 19.0355 31.2985 19.9967 31.8402 21.1346C28.6868 25.296 23.5815 28 17.8188 28C14.1375 28 11.0188 27.2133 8.48551 25.8333V13.428C10.1077 13.6604 11.6395 14.3177 12.9255 15.3333ZM5.81885 12C6.14543 12 6.46063 12.1199 6.70468 12.3369C6.94872 12.5539 7.10464 12.853 7.14285 13.1773L7.15218 13.3333V25.3333C7.15218 25.6869 7.0117 26.0261 6.76166 26.2761C6.51161 26.5262 6.17247 26.6666 5.81885 26.6666H3.15218C2.79856 26.6666 2.45942 26.5262 2.20937 26.2761C1.95932 26.0261 1.81885 25.6869 1.81885 25.3333V13.3333C1.81885 12.9797 1.95932 12.6406 2.20937 12.3905C2.45942 12.1405 2.79856 12 3.15218 12H5.81885ZM18.6802 4.76665L19.1522 5.23998L19.6242 4.76798C19.9333 4.45627 20.3009 4.20868 20.7059 4.03942C21.1109 3.87016 21.5454 3.78257 21.9843 3.78167C22.4233 3.78077 22.8581 3.86659 23.2638 4.03419C23.6696 4.20179 24.0382 4.44787 24.3485 4.75831C24.6589 5.06875 24.9049 5.43743 25.0723 5.84319C25.2398 6.24895 25.3255 6.6838 25.3245 7.12277C25.3235 7.56173 25.2358 7.99617 25.0664 8.40115C24.897 8.80612 24.6493 9.17366 24.3375 9.48265L19.1522 14.6666L13.9655 9.47998C13.6538 9.1709 13.4062 8.8033 13.237 8.39828C13.0677 7.99325 12.9801 7.55879 12.9792 7.11982C12.9783 6.68085 13.0641 6.24603 13.2317 5.84032C13.3993 5.43461 13.6454 5.06599 13.9558 4.75564C14.2663 4.44529 14.635 4.19931 15.0407 4.03182C15.4465 3.86434 15.8813 3.77865 16.3203 3.77967C16.7593 3.78069 17.1937 3.86841 17.5987 4.03778C18.0037 4.20716 18.3712 4.45485 18.6802 4.76665Z"
        fill="#00BBC7"
      />
    </svg>
  )
}

const categories = [
  {
    title: CATEGORY_AUTHENTICATION.title,
    description: 'Discord, Tweet, Wallet, SMS',
    icon: <KeySvgIcon />,
  },
  {
    title: CATEGORY_REWARD_POINTS.title,
    description: 'Ongoing or limited rewards',
    icon: <PointSvgIcon />,
  },
  {
    title: CATEGORY_SOCIAL_FOLLOW.title,
    description: 'Twitter, Instagram',
    icon: <SocialFollowIcon />,
  },
  {
    title: CATEGORY_SOCIAL_SHARE.title,
    description: 'Twitter Retweet',
    icon: <SocialShareIcon />,
  },
  {
    title: CATEGORY_COMMUNITY_ENGAGEMENT.title,
    description: 'Code quests or Image Upload',
    icon: <CommunityEngagementIcon />,
  },
  {
    title: CATEGORY_PARTNERSHIP.title,
    description: 'Partner domain authentications',
    icon: <PartnershipIcon />,
  },
]
