
// UI
import { Flex, Heading, Text, Progress } from '@chakra-ui/react'

// Types
import type { ColumnDef } from 'react-table';
import { CompletedQuest } from './types'

const columnsData: ColumnDef<CompletedQuest[]> = [
  {
    Header: 'CHALLENGE',
    accessor: (row: CompletedQuest) => {
      const { name } = row
      return (
        <Heading color="white" fontSize="14px" fontWeight="700">
          {name}
        </Heading>
      )
    },
  },
  {
    Header: 'FINISHED',
    accessor: (row: CompletedQuest) => {
      const { finished } = row
      return (
        <Text color="white" fontSize="sm" fontWeight="400">
          {finished}
        </Text>
      )
    },
  },
  {
    Header: 'COMPLETION RATE',
    accessor: (row: CompletedQuest) => {
      const { rate } = row
      return (
        <Flex align="center" justifyContent={'start'} gap="13px">
          <Text color="white" fontSize="sm" fontWeight="400">
            {rate}%
          </Text>
          <Progress colorScheme="blue" h="8px" w="108px" value={rate} />
        </Flex>
      )
    },
  },
] 

export default columnsData