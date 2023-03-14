import React, { StrictMode, useEffect } from 'react'

import "react-datepicker/dist/react-datepicker.css";
import '../styles/globals.css'

import { Web3Provider } from 'context/Web3Context'
import { SessionProvider } from 'next-auth/react'
import { AdminGuard } from '@components/admin/layout/AdminGuard'
import { QueryClient, QueryClientProvider } from 'react-query'
import Script from 'next/script'
import * as gtag from '../lib/ga/gtag'
import { useRouter } from 'next/router'
import { ChakraProvider, Box } from '@chakra-ui/react'
import theme from 'theme/theme'
import AdminLayout from '@components/admin/AdminLayout'
import { useWindowSize } from 'react-use'

export function reportWebVitals(metric) {
  // console.log(metric);
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <SessionProvider
      session={pageProps.session}
      basePath={`/api/auth`}
      refetchInterval={3600} // Re-fetches session when window is focused
      refetchOnWindowFocus={true}
    >
      <Web3Provider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <StrictMode>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <Script strategy="lazyOnload">
              {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                                page_path: window.location.pathname, 'debug_mode':true
                                });
                            `}
            </Script>
            <ChakraProvider theme={theme}>


              {Component.requireAdmin ? (
                <AdminLayout {...pageProps}>
                  <AdminGuard>
                    <Component {...pageProps} />
                  </AdminGuard>
                </AdminLayout>
              ) : (

                <LayoutWrapper>
                  <Component {...pageProps} key={router.asPath} />
                </LayoutWrapper>

              )}
            </ChakraProvider>
          </StrictMode>
        </QueryClientProvider>
      </Web3Provider>
    </SessionProvider>
  )
}

export default MyApp

const LayoutWrapper = ({ children }) => {

  const ref = use100vh()
  return (
    <Box
      w="100%"
      ref={ref}
      display={'flex'}
      position={'relative'}
      flexDirection="column"
      className="layout-wrapper"
    >
      <Box
        position="absolute"
        w="100%"
        h="100%"
        __css={{
          background:
            'linear-gradient(rgba(29, 99, 255, 0.5),  rgba(29, 99, 255, 0.5)), url(/img/user/banner.png)',
        }}
        backgroundPosition="center"
        backgroundSize={'cover'}
        backgroundRepeat="no-repeat"
        display={'flex'}
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        {children}
      </Box>
    </Box>
  )
}

function use100vh() {
  const ref = React.useRef()
  const { height } = useWindowSize()

  React.useEffect(() => {
    if (!ref.current) {
      return
    }
    ref.current.style.height = height + 'px'
  }, [height])

  return ref
}