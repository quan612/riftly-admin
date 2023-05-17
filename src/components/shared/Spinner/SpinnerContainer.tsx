import { Flex, Spinner } from '@chakra-ui/react'

const SpinnerContainer = () => {
  return (
    <Flex
          my="auto"
          h="56px"
          align="center"
          justify="center"
        >
          <Spinner size="lg" />
        </Flex>
  )
}
export default SpinnerContainer