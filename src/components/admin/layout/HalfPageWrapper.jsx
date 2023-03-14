import React from 'react'
import { Flex } from '@chakra-ui/react'

export default function HalfPageWrapper({ children }) {
  return (
    <Flex
      w="100%"
      maxW="container.md"
      mb="24px"
      className="half-page-wrapper"
      flexDirection="column"
      gap="20px"
    >
      {children}
    </Flex>
  )
}
