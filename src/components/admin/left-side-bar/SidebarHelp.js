import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'

export function SidebarHelp(props) {

  const { children, sidebarVariant, ...rest } = props

  return (
    <Stack
      justify="center"
      direction="column"
      align="center"

      mb="24px"
      mt="auto"
      position='relative'
    >
      <HelpNavBoxSvg />
      <Box position='absolute' h='100%' w='100%'>
        <Flex direction="column" textAlign="center" px='16px' h='100%' justify='space-evenly'>
          <Text fontSize="20px" fontWeight="bold">
            Need Help?
          </Text>
          <Text fontSize="16px" >
            Get in touch with our support team at support@qu3st.io
          </Text>
          <Button variant='ghost'>Get in touch</Button>
        </Flex>
      </Box>

    </Stack>
  )
}

const HelpNavBoxSvg = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 242 224" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="242" height="224" rx="20" fill="#2F4E6D" />
    </svg>
  )
}
