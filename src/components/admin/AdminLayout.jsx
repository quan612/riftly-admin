import React, { useState } from 'react'

import { Box, Flex, Portal, useDisclosure, useColorMode, Stack } from '@chakra-ui/react'
import MainPanel from './layout/MainPanel'
import PanelContent from './layout/PanelContent'
import PanelContainer from './layout/PanelContainer'
import routes from './routes'

import { RiftlyLogoWhiteText } from '@components/shared/Logo'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const Sidebar = dynamic(() => import('./left-side-bar/Sidebar'), { ssr: false })
const AdminNavbar = dynamic(() => import('./nav/AdminNavbar'), { ssr: false })

export default function AdminLayout({ session, children }) {
  const [fixed, setFixed] = useState(false)
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const getBackPath = (routes) => {
    let backPath = ''

    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].children)
        if (categoryActiveRoute !== backPath) {
          return categoryActiveRoute
        }
      }

      if (
        typeof window !== 'undefined' &&
        window?.location.pathname === routes[i].path &&
        routes[i].backPath
      ) {
        return routes[i].backPath
      }
    }
    return backPath
  }

  const getBackText = (routes) => {
    let backText = ''

    for (let i = 0; i < routes.length; i++) {
      // new
      if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].children)
        if (categoryActiveRoute !== backText) {
          return categoryActiveRoute
        }
      }

      if (
        typeof window !== 'undefined' &&
        window?.location.pathname === routes[i].path &&
        routes[i].backText
      ) {
        return routes[i].backText
      }
    }
    return backText
  }

  const getActiveRoute = (routes) => {
    let activeRoute = ''

    for (let i = 0; i < routes.length; i++) {
      // new
      if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].children)
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute
        }
      }

      if (typeof window !== 'undefined' && window?.location.pathname === routes[i].path) {
        return routes[i].name
      }
    }
    return activeRoute
  }
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes) => {
    let activeNavbar = false
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].children)
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar
        }
      }
    }
    return activeNavbar
  }

  return (
    <Box>
      {session && (
        <Sidebar
          routes={routes}
          logo={
            <Stack direction="row" spacing="12px" align="center" justify="center">
              <RiftlyLogoWhiteText />
            </Stack>
          }
          display="none"
          session={session}
        />
      )}

      <MainPanel
        w={{
          base: '100%',
          xl: 'calc(100% - 260px)',
        }}
      >
        <AdminNavbar
          onOpen={onOpen}
          brandText={getActiveRoute(routes)}
          secondary={getActiveNavbar(routes)}
          fixed={fixed}
          session={session}
          backText={getBackText(routes)}
          backPath={getBackPath(routes)}
        />

        <PanelContent>
          <PanelContainer>
            <Flex direction="column" pt={{ base: '100px', md: '100px' }}>
              {children}
            </Flex>
          </PanelContainer>
        </PanelContent>
      </MainPanel>
    </Box>
  )
}
