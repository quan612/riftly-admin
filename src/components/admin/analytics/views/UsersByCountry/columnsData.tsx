// UI
import { Flex, Heading, Text, Progress } from '@chakra-ui/react'

// Types
import type { ColumnDef } from 'react-table'
import { UsersByCountryDef } from './types'

const columnsData: ColumnDef<UsersByCountryDef[]> = [
  {
    Header: 'COUNTRY',
    accessor: (row: UsersByCountryDef) => {
      const { country } = row
      return (
        <Heading color="white" fontSize="14px" fontWeight="700">
          {country}
        </Heading>
      )
    },
   
  },
  {
    Header: 'USERS',
    accessor: (row: UsersByCountryDef) => {
      const { percentage, users } = row
      return (
        <Flex align="center" justifyContent={'start'} gap="13px">
          <Progress colorScheme="blue" h="8px" minW="75px" w="auto" value={percentage} />
          <Text color="white" fontSize="sm" fontWeight="400">
            {users}
          </Text>
        </Flex>
      )
    },
  },
]

export default columnsData
