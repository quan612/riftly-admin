import { HamburgerIcon } from '@chakra-ui/icons'

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { IconBox } from '@components/shared/Icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import {
//   renderThumbDark,
//   renderThumbLight,
//   renderTrack,
//   renderTrackRTL,
//   renderView,
//   renderViewRTL
// } from "components/Scrollbar/Scrollbar";
// import { HSeparator } from "components/Separator/Separator";
import React, { useCallback } from 'react'

// import { Scrollbars } from "react-custom-scrollbars";

import { MdDarkMode, MdExpandLess, MdExpandMore, MdLightMode, MdMenu } from 'react-icons/md'
import { SidebarHelp } from './SidebarHelp'

function Sidebar(props) {
  const { sidebarVariant } = props
  const router = useRouter()
  const [state, setState] = React.useState({})

  const mainPanel = React.useRef()
  let variantChange = '0.2s linear'

  const { colorMode } = useColorMode
  let activeBg = useColorModeValue('white', 'navy.700')
  let inactiveBg = useColorModeValue('white', 'navy.700')
  let activeColor = useColorModeValue('gray.700', 'white')
  let inactiveColor = useColorModeValue('gray.400', 'gray.400')
  let sidebarActiveShadow = '0px 7px 11px rgba(0, 0, 0, 0.04)'

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return router.pathname === routeName ? true : false
  }

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = useCallback(
    (routes) => {
      // Chakra Color Mode

      return routes?.map((prop, key) => {
        if (prop?.category) {
          return (
            <Accordion allowMultiple key={key}>
              <AccordionItem key={key} border="none">
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Box boxSize={'24px'}> {prop.icon} </Box>
                      <Text m={0} fontWeight={'bold'} fontSize="lg">
                        {prop.category}
                      </Text>
                      {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                    </AccordionButton>
                    <AccordionPanel p={0}>
                      <List>
                        {prop.children.map((child) => {
                          // const { label, path, filterParams, Icon } =
                          //   menuItem;

                          const { name, path } = child

                          const isActive = activeRoute(path)

                          return (
                            <ListItem
                              // as={Link}

                              as={Button}
                              variant={'ghost'}
                              w={'full'}
                              borderRadius={'0'}
                              display={'flex'}
                              justifyContent={'start'}
                              p={3}
                              href={'/'}
                              key={name}
                              onClick={() =>
                                // navigateToDiscover(path, filterParams)
                                router.push(path)
                              }
                            >
                              {/* <ListIcon
                             as={() =>
                               Icon({
                                 size: "1.25em",
                                 style: { marginRight: "0.75rem" },
                               })
                             }
                             /> */}
                              <Text
                                mt={-1}
                                ml="1.5rem"
                                color={isActive ? activeColor : inactiveColor}
                                my="auto"
                                fontSize="md"
                              >
                                {name}
                              </Text>
                            </ListItem>
                          )
                        })}
                      </List>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Accordion>
          )
        }
        if (prop?.showOnSidebar) {
          return (
            <Link key={key} href={prop.path}>
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg="transparent"
                borderColor='transparent'
                mb={{
                  xl: '6px',
                }}
                mx={{
                  xl: 'auto',
                }}
                py="12px"
                ps={{
                  sm: '10px',
                  xl: '16px',
                }}
                borderRadius="15px"
                _hover="none"
                w="100%"
                _active={{
                  bg: 'inherit',
                  transform: 'none',
                  borderColor: 'transparent',
                }}
                _focus={{
                  boxShadow: 'none',
                }}
              >
                <Flex alignItems={'start'} gap="1rem">
                  <Box boxSize={'24px'}> {prop.icon} </Box>
                  <Heading color={activeColor} my="auto" fontSize="lg">
                    {prop.name}
                  </Heading>
                </Flex>
              </Button>
            </Link>
          )
        }

      })
    },
    [window],
  )
  const { logo, routes } = props

  var links = <>{routes && createLinks(routes)}</>

  let sidebarRadius = '20px'
  let sidebarMargins = '0px'
  var brand = (
    <Box pt={'25px'} mb="12px">
      {logo}
      {/* <HSeparator my="26px" /> */}
      <Divider mt="1rem" />
    </Box>
  )

  // SIDEBAR
  return (
    <Box ref={mainPanel} className='non responsive sidebar'>
      <Box display={{ base: 'none', xl: 'block' }} position="fixed">
        <Box
          bg={'brand.neutral4'}
          transition={variantChange}
          w="260px"
          maxW="260px"
          h="75vh"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
          borderTopRightRadius={sidebarRadius}
          borderBottomRightRadius={sidebarRadius}
          display='flex'
          flexDirection='column'
        >
          {/* <Scrollbars
            autoHide
            renderTrackVertical={
              document.documentElement.dir === "rtl"
                ? renderTrackRTL
                : renderTrack
            }
            renderThumbVertical={useColorModeValue(
              renderThumbLight,
              renderThumbDark
            )}
            renderView={
              document.documentElement.dir === "rtl"
                ? renderViewRTL
                : renderView
            }
          >*/}
          <>
            <Box>{brand}</Box>
            <Stack direction="column" mb="40px">
              <Box>{links}</Box>
            </Stack>
          </>
          <SidebarHelp sidebarVariant={sidebarVariant} />
          {/* </Scrollbars> */}
        </Box>
      </Box>
    </Box>
  )
}

// FUNCTIONS

export function SidebarResponsive(props) {
  const router = useRouter()
  const { logo, routes, colorMode, hamburgerColor, ...rest } = props

  // this is for the rest of the collapses
  const [state, setState] = React.useState({})
  const mainPanel = React.useRef()
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return true
    // return location.pathname === routeName ? "active" : "";
  }
  // Chakra Color Mode
  let activeBg = useColorModeValue('white', 'navy.700')
  let inactiveBg = useColorModeValue('white', 'navy.700')
  let activeColor = useColorModeValue('gray.700', 'white')
  let inactiveColor = useColorModeValue('gray.400', 'white')
  let sidebarActiveShadow = useColorModeValue('0px 7px 11px rgba(0, 0, 0, 0.04)', 'none')
  let sidebarBackgroundColor = 'brand.neutral4'

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.category) {
        return (
          <Accordion allowMultiple key={key}>
            <AccordionItem key={key} border="none">
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Text m={0} fontWeight={'bold'} fontSize="lg">
                      {prop.category}
                    </Text>
                    {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                  </AccordionButton>
                  <AccordionPanel p={0}>
                    <List>
                      {prop.children.map((child) => {
                        // const { label, path, filterParams, Icon } =
                        //   menuItem;

                        const { name, path } = child

                        const isActive = activeRoute(path)

                        return (
                          <ListItem
                            // as={Link}

                            as={Button}
                            variant={'ghost'}
                            w={'full'}
                            borderRadius={'0'}
                            display={'flex'}
                            justifyContent={'start'}
                            p={3}
                            href={'/'}
                            key={name}
                            onClick={() =>
                              // navigateToDiscover(path, filterParams)
                              router.push(path)
                            }
                          >
                            {/* <ListIcon
                             as={() =>
                               Icon({
                                 size: "1.25em",
                                 style: { marginRight: "0.75rem" },
                               })
                             }
                             /> */}
                            <Text
                              mt={-1}
                              ml="1.5rem"
                              color={isActive ? activeColor : inactiveColor}
                              my="auto"
                              fontSize="md"
                            >
                              {name}
                            </Text>
                          </ListItem>
                        )
                      })}
                    </List>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
        )
      }

      if (prop?.showOnSidebar)
        return (

          <Link key={key} href={prop.path}>
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              borderColor={"transparent"}
              mb={{
                xl: '6px',
              }}
              mx={{
                xl: 'auto',
              }}
              py="12px"
              ps={{
                sm: '10px',
                xl: '16px',
              }}
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              <Flex alignItems={'start'} gap="1rem">
                <Box boxSize={'24px'}> {prop.icon} </Box>
                <Heading color={activeColor} my="auto" fontSize="lg">
                  {prop.name}
                </Heading>
              </Flex>
            </Button>
          </Link>
        )
    })
  }

  var links = <>{createLinks(routes)}</>

  //  BRAND

  var brand = (
    <Box pt={'35px'} mb="8px">
      {logo}
      {/* <HSeparator my="26px" /> */}
    </Box>
  )

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  // Color variables
  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} ref={mainPanel} alignItems="center">
      <HamburgerIcon color={hamburgerColor} w="18px" h="18px" ref={btnRef} onClick={onOpen} />
      <Drawer isOpen={isOpen} onClose={onClose} placement={'left'} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent
          w="280px"
          maxW="280px"
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="100%">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              <SidebarHelp />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default Sidebar
