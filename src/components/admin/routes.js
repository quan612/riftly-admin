
import { HomeIcon } from '@components/shared/Icons'
import React, { Component } from 'react'
import { GiPlanetConquest } from 'react-icons/gi'
import { Box, Flex, Text } from '@chakra-ui/react'


const QuestNavIcon = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_584_2158)">
        <path d="M7.46683 10.7333H7.70016C8.5985 10.7333 9.3335 11.4683 9.3335 12.3667V20.5333C9.3335 21.4317 8.5985 22.1667 7.70016 22.1667H7.46683C6.5685 22.1667 5.8335 21.4317 5.8335 20.5333V12.3667C5.8335 11.4683 6.5685 10.7333 7.46683 10.7333ZM14.0002 5.83334C14.8985 5.83334 15.6335 6.56834 15.6335 7.46668V20.5333C15.6335 21.4317 14.8985 22.1667 14.0002 22.1667C13.1018 22.1667 12.3668 21.4317 12.3668 20.5333V7.46668C12.3668 6.56834 13.1018 5.83334 14.0002 5.83334ZM20.5335 15.1667C21.4318 15.1667 22.1668 15.9017 22.1668 16.8V20.5333C22.1668 21.4317 21.4318 22.1667 20.5335 22.1667C19.6352 22.1667 18.9002 21.4317 18.9002 20.5333V16.8C18.9002 15.9017 19.6352 15.1667 20.5335 15.1667Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_584_2158">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>

  )
}

const SettingNavIcon = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_584_2145)">
        <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_584_2145">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>

  )
}

const UserNavIcon = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_584_1946)">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V18C20 15.34 14.67 14 12 14Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_584_1946">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>

  )
}

const RewardNavIcon = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_739_2638)">
        <path d="M4 13H10C10.55 13 11 12.55 11 12V4C11 3.45 10.55 3 10 3H4C3.45 3 3 3.45 3 4V12C3 12.55 3.45 13 4 13ZM4 21H10C10.55 21 11 20.55 11 20V16C11 15.45 10.55 15 10 15H4C3.45 15 3 15.45 3 16V20C3 20.55 3.45 21 4 21ZM14 21H20C20.55 21 21 20.55 21 20V12C21 11.45 20.55 11 20 11H14C13.45 11 13 11.45 13 12V20C13 20.55 13.45 21 14 21ZM13 4V8C13 8.55 13.45 9 14 9H20C20.55 9 21 8.55 21 8V4C21 3.45 20.55 3 20 3H14C13.45 3 13 3.45 13 4Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_739_2638">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>

  )
}

const routes = [
  /** Dashboard Analytics **/
  {
    name: 'Dashboard',
    path: '/',
    icon: <HomeIcon />,
    showOnSidebar: true,
  },
  /** Reward paths **/
  {
    name: 'Rewards',
    path: '/reward',
    showOnSidebar: true,
    icon: <RewardNavIcon />
  },
  {
    name: 'Reward Users',
    path: '/reward/send-rewards',
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Rewards</Text>
      </Flex>
    ),
    backPath: '/reward'
  },
  {
    name: 'Single Reward',
    path: '/reward/send-rewards/single',

    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Send Reward</Text>
      </Flex>
    ),
    backPath: '/reward/send-rewards'
  },
  {
    name: 'Bulk Reward',
    path: '/reward/send-rewards/bulk',
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Send Reward</Text>
      </Flex>
    ),
    backPath: '/reward/send-rewards'
  },
  {
    name: 'Config Reward Types',
    path: '/reward/config',
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Rewards</Text>
      </Flex>
    ),
    backPath: '/reward'
  },
  {
    name: 'Shop Items',
    path: '/reward/shop',
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Rewards</Text>
      </Flex>
    ),
    backPath: '/reward'
  },
  {
    name: 'Add a New Shop Item',
    path: '/reward/shop/add',
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Shop</Text>
      </Flex>
    ),
    backPath: '/reward/shop'
  },
  {
    name: 'Edit Shop Item',
    path: '/reward/shop/edit',
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Shop</Text>
      </Flex>
    ),
    backPath: '/reward/shop'
  },
  /** Quest paths **/
  {
    name: 'Quests',
    path: '/quest',
    icon: <QuestNavIcon />,
    showOnSidebar: true,
  },
  {
    name: 'Create New Quest',
    path: '/quest/add',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Quests</Text>
      </Flex>
    ),
    backPath: '/quest'
  },
  {
    name: 'Edit Quest',
    path: '/quest/edit',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Quests</Text>
      </Flex>
    ),
    backPath: '/quest'
  },
  /** Setting paths **/
  {
    name: 'Setting',
    path: '/setting',
    icon: <SettingNavIcon />,
    showOnSidebar: true,
  },
  {
    name: 'Edit Discord Setting',
    path: '/setting/discord',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  {
    name: 'Edit Twitter Setting',
    path: '/setting/twitter',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  {
    name: 'Edit Google Analytics',
    path: '/setting/analytics',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  {
    name: 'Edit SMS Setting',
    path: '/setting/sms',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  {
    name: 'Edit Image Hosting Setting',
    path: '/setting/image-hosting',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  {
    name: 'Edit Misc',
    path: '/setting/misc',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  {
    name: 'Configure Admins',
    path: '/setting/admin',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  {
    name: 'Configure Nft Contracts Data',
    path: '/setting/nft-contracts',
    icon: <GiPlanetConquest />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Setting</Text>
      </Flex>
    ),
    backPath: '/setting'
  },
  /** Users */
  {
    name: 'Users',
    path: '/user',
    icon: <UserNavIcon />,
    showOnSidebar: true,

  },
  {
    name: 'Add User',
    path: '/user/add',
    icon: <UserNavIcon />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Users</Text>
      </Flex>
    ),
    backPath: '/user'
  },
  {
    name: 'Bulk Add Users',
    path: '/user/bulk',
    icon: <UserNavIcon />,
    showOnSidebar: false,
    backText: (
      <Flex gap="1.5rem">
        <Text>{'<'}</Text>
        <Text>Back to Users</Text>
      </Flex>
    ),
    backPath: '/user'
  },
  /** Search */
  // {
  //   name: 'Search',
  //   category: 'Search',
  //   children: [
  //     {
  //       name: 'User Quest',
  //       path: '/search/user-quests',
  //       showOnSidebar: true,
  //     },
  //     {
  //       name: 'Users',
  //       path: '/search/users',
  //       showOnSidebar: true,
  //     },
  //   ],
  // },
]

export default routes

