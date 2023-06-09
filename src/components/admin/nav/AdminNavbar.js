import {
  Box,

  Flex,
  Link,
  useColorModeValue,
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import AdminNavbarLinks from './AdminNavbarLinks'
import { useRouter } from 'next/router'

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', changeNavbar)
    return () => {
      window.removeEventListener('scroll', changeNavbar)
    }
  })
  const router = useRouter()
  const { backText, backPath, variant, children, fixed, secondary, brandText, onOpen, session, ...rest } = props

  let mainText = useColorModeValue('gray.700', 'gray.200')

  let secondaryText = useColorModeValue('gray.700', 'gray.200')

  let navbarPosition = 'absolute'
  let navbarFilter = 'none'
  let navbarBackdrop = 'none'
  let navbarShadow = 'none'
  let navbarBg = 'none'
  let navbarBorder = 'transparent'
  let secondaryMargin = '0px'
  let paddingX = '15px'
  if (props.fixed === true)

    if (props.secondary) {
      navbarBackdrop = 'none'
      navbarPosition = 'absolute'
      mainText = 'white'
      secondaryText = 'white'
      secondaryMargin = '22px'
      paddingX = '30px'
    }
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  return (
    <Flex
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      borderRadius="16px"
      display="flex"
      minH="100px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      px={{
        sm: paddingX,
        md: '24px',
      }}

      pt="8px"
      top="18px"
      w={{ base: 'calc(100vw - 30px)', xl: 'calc(100vw  - 280px)' }}
      className='admin-navbar'
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: 'row',// column
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
      >
        {/* left part */}
        <Box mb={{ sm: '8px', md: '0px' }}>
          {/* Here we create navbar brand, based on route name */}
          <Text
            color={mainText}
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
            fontSize={{ base: 'lg', lg: 'xl' }}
          >
            {brandText}
          </Text>

          <Text
            as={Link}
            cursor="pointer"
            color={'brand.neutral1'}
            bg="inherit"
            borderRadius="inherit"
            onClick={() => {
              router.push(backPath)
            }}

            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
            fontSize={{ base: 'sm', lg: 'md' }}
          >
            {backText}
          </Text>

        </Box>
        {/* right part */}
        <Box
          ms="auto"
          className='top-right-navbar'
          w={{ sm: 'auto', md: 'unset' }}
        >
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
            session={session}
          />
        </Box>
      </Flex>
    </Flex>
  )
}
