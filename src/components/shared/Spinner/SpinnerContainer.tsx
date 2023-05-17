import { Flex, Spinner } from '@chakra-ui/react'

const SpinnerContainer = () => {
  return (
    <Flex
          my="auto"
          h="56px"
          align={{ base: 'center', xl: 'center' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          <Spinner size="lg" />
        </Flex>
  )
}
export default SpinnerContainer