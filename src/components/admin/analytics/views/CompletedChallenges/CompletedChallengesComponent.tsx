// Components
import SimpleTable from '@components/shared/Table/SimpleTable'

// Hooks
import { useCompletedQuestQuery } from './hook'

// UI
import { Flex, Heading, Spinner } from '@chakra-ui/react'
import Card from '@components/shared/Card'

import columnsData from './columnsData'

export default function CompletedChallengesComponent() {
  const {data: completedQuests, isLoading: isLoadingCompletedQuests} = useCompletedQuestQuery()

  return (
    <Card direction="column" w="100%" px="0px" overflowX="hidden">
      <Flex px="25px" justify="space-between" mb="24px" align="center">
        <Heading fontSize="xl" fontWeight="700" lineHeight="24px">
          Top Completed Challenges
        </Heading>
      </Flex>
      {isLoadingCompletedQuests && (
        <Flex
          my="auto"
          h="56px"
          align={{ base: 'center', xl: 'center' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          <Spinner size="lg" />
        </Flex>
      )}
      {completedQuests && <SimpleTable tableData={completedQuests} columnsData={columnsData} />}
    </Card>
  )
}
