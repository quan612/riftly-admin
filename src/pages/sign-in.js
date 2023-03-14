import React, { useEffect, useState, useContext } from 'react'
import { Web3Context } from '@context/Web3Context'
import Enums from 'enums'

import { MetamaskIcon, WalletConnectIcon } from '@components/shared/Icons'
import { Heading, Flex, Text, Button, HStack, Progress, Box } from '@chakra-ui/react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import useDeviceDetect from '@hooks/useDeviceDetect'

const CONNECTABLE = 1
const AUTHENTICATING = 2
const AUTHENTICATED = 3
const ERROR = 4

export default function AdminSignIn() {
  const { adminSignIn, web3Error } = useContext(Web3Context)
  const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false)
  const { isMobile } = useDeviceDetect()
  const [currentView, setView] = useState(CONNECTABLE)
  const [error, errorSet] = useState()

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && session?.user?.isAdmin) {
      router.push('/')
    }
    const ethereum = window.ethereum
    setIsMetamaskDisabled(!ethereum || !ethereum.on)
  }, [session, router])

  return (
    <ShortContainer>
      <Flex
        gap={{ base: '1rem', lg: '3rem' }}
        direction="column"
        w="80%"
        h="80%"
        alignItems={'center'}
        justifyContent="center"
      >
        {currentView === CONNECTABLE && (
          <>
            <Heading color="white" fontSize={'xl'} align="center">
              Admin Sign In
            </Heading>

            {!isMetamaskDisabled && (
              <Button
                variant="wallet"
                onClick={async () => {
                  try {
                    setView(AUTHENTICATING)
                    await adminSignIn(Enums.METAMASK)
                  } catch (error) {
                    errorSet(error.message)
                    setView(ERROR)
                  }
                }}
                minW="100%"
                borderRadius="24px"
              >
                <HStack>
                  <MetamaskIcon />
                  <Text>Metamask</Text>
                </HStack>
              </Button>
            )}

            <Button
              variant="twitter"
              onClick={async () => {
                try {
                  setView(AUTHENTICATING)
                  await adminSignIn(Enums.WALLETCONNECT)
                } catch (error) {
                  errorSet(error.message)
                  setView(ERROR)
                }
              }}
              minW="100%"
              borderRadius="24px"
            >
              <HStack>
                <WalletConnectIcon />
                <Text>Wallet Connect</Text>
              </HStack>
            </Button>
          </>
        )}

        {currentView === AUTHENTICATING && <Progress size="xs" isIndeterminate w="80%" />}

        {currentView === ERROR && (
          <>
            <Heading color="white" fontSize={'xl'} align="center">
              Error authenticating
            </Heading>
            {error && <Text color="red.300">{error}</Text>}
            {web3Error && <Text color="red.300">{web3Error}</Text>}

            <Button variant="blue" onClick={() => setView(CONNECTABLE)} minW="100%" borderRadius="24px" w="100%">
              Back
            </Button>
          </>
        )}

        {currentView === AUTHENTICATED && <Text>Redirecting...</Text>}
      </Flex>
    </ShortContainer>
  )
}


const ShortContainer = ({ children }) => {
  return (
    <Flex
      w="100%"
      alignItems="center"
      justifyContent={'center'}
      mt={{ base: '0.25rem', lg: '0px' }}
    >
      <Box
        className="short-container"
        w={'container.sm'}
        maxW="container.sm"
        bg={'brand.neutral4'}
        color="#262626"
        height={{ base: 'auto', lg: '429px' }}
        borderRadius="16px"
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        zIndex="2"
        me={{ base: '24px', xl: '0px' }}
        ms={{ base: '24px', xl: '0px' }}
        p={'3rem 56px'}
      >
        <Flex
          w="100%"
          h="100%"
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'space-around'}
          gap={{ base: '16px', md: '48px' }}
        >
          {children}
        </Flex>
      </Box>
    </Flex>
  )
}