
import { BellIcon, SettingsIcon } from '@chakra-ui/icons'

import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { RiftlyLogoWhiteText } from '@components/shared/Logo'
import { SidebarResponsive } from '../left-side-bar/Sidebar'

import routes from '../routes'
import React, { useContext } from 'react'
import { Web3Context } from '@context/Web3Context'
import AdminLogin from '../AdminLogin'


export default function HeaderLinks(props) {
  const { variant, children, fixed, scrolled, secondary, onOpen, session, ...rest } = props

  const { colorMode } = useColorMode()

  const navbarIcon = useColorModeValue('gray.400', 'white')
  let menuBg = 'brand.neutral4'
  const textColor = useColorModeValue('secondaryGray.900', 'white')

  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  )
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)')
  const walletSignInModal = useDisclosure()
  const { SignOut } = useContext(Web3Context)

  return (
    <Flex
      ps={{ sm: '10px', md: '16px' }}
      pe={{ sm: '10px', md: '16px' }}
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
      gap="8px"
    >

      <SidebarResponsive
        hamburgerColor={'white'}
        logo={
          <Stack direction="row" spacing="12px" align="center" justify="center">
            <RiftlyLogoWhiteText />
          </Stack>
        }
        colorMode={colorMode}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      <SettingsIcon
        cursor="pointer"
        me={{ base: '16px', xl: '0px' }}
        ms={{ base: '16px', xl: '0px' }}
        onClick={props.onOpen}
        color={navbarIcon}
        w="18px"
        h="18px"
      />

      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name="Riftly"
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          zIndex={11}
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey {session?.user?.username}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">


            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
            >
              {!session ? (
                <>
                  {walletSignInModal?.isOpen && (
                    <AdminLogin
                      isOpen={walletSignInModal.isOpen}
                      onClose={() => {
                        walletSignInModal.onClose()
                      }}
                    />
                  )}
                  <Text fontSize="sm" onClick={() => walletSignInModal.onOpen()}>
                    Sign In
                  </Text>
                </>
              ) : (
                <>
                  <Text fontSize="sm" onClick={() => SignOut()}>
                    Log out
                  </Text>
                </>
              )}
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  )
}
