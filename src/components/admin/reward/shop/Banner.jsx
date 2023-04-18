import { AdminBanner } from '@components/shared/Card'
import { Heading, Flex, Button, ButtonGroup } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

const Banner = ({ count, onAddNew }) => {
  return (
    <AdminBanner>
      <Flex
        mb={{ sm: '10px', md: '0px' }}
        w={'100%'}
        textAlign={{ base: 'start' }}
        justifyContent="space-between"
      >
        <Flex direction="column" maxWidth="100%" my={{ base: '14px' }} gap="1rem">
          <Heading fontSize={{ base: 'lg', lg: '3xl' }} color={'white'} fontWeight="700">
            {count} Shop Items
          </Heading>
        </Flex>
        <ButtonGroup
          h="100%"
          alignItems={'center'}
          alignSelf="flex-end"
          gap="1rem"
          size="md"
          fontWeight="semibold"
          fontSize="lg"
        >
          <Button
            variant="cyan"
            borderColor={'white'}
            leftIcon={<AddIcon boxSize={'16px'} />}
            onClick={onAddNew}
          >
            Add New
          </Button>
        </ButtonGroup>
      </Flex>
    </AdminBanner>
  )
}

export default Banner
