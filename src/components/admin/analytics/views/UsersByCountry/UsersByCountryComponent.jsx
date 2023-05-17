// Components
import SimpleTable from '@components/shared/Table/SimpleTable'
import Card from '@components/shared/Card'
import SpinnerContainer from '@components/shared/Spinner/SpinnerContainer'

// UI
import { Flex, Heading } from '@chakra-ui/react'

// Hooks
import { useUsersByCountryQuery } from './hook'
import columnsData from './columnsData'

const UsersByCountryHeading = () => {
  return (
    <Flex px="25px" justify="space-between" mb="24px" align="center">
      <Heading fontSize="xl" fontWeight="700" lineHeight="24px">
        Top Countries
      </Heading>
    </Flex>
  )
}

export default function UsersByCountryComponent() {
  const { data: usersByCountry, isLoading: isLoadingStatistics } = useUsersByCountryQuery()

  return (
    <Card direction="column" w="100%" px="0px" h="100%">
      <UsersByCountryHeading />

      {isLoadingStatistics && <SpinnerContainer />}
      {usersByCountry?.isError && (
        <Flex p="5px" h="100%" w="100%" justifyContent={'center'}>
          Fail to load GA configuration.
        </Flex>
      )}
      {usersByCountry && usersByCountry.length === 0 && (
        <Flex p="5px" h="100%" w="100%" justifyContent={'center'}>
          No historical data
        </Flex>
      )}
      {usersByCountry && usersByCountry.length > 0 && (
        <SimpleTable tableData={usersByCountry} columnsData={columnsData} />
      )}
    </Card>
  )
}
