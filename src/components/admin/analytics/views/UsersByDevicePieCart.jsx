import React, { useEffect, useState, useCallback } from 'react'
import { Box, Flex, Text, Select, useColorModeValue, Heading, Spinner } from '@chakra-ui/react'
import Card from '@components/shared/Card'
import ApexPieChart from '@components/shared/Charts/ApexPieChart'
import axios from 'axios'
import { LAST_YEAR, THIS_YEAR } from '@enums/index'
import { capitalizeFirstLetter } from '@util/index'

const chartId = 'pie-user-by-type'

const pieChartOptions = {
  chart: {
    id: chartId,
    width: '50px',
  },
  series: [50, 25],
  labels: ['Desktop', 'Mobile'], //, "Tablet"],
  colors: ['rgba(29, 99, 255, 1)', 'rgba(29, 99, 255, 0.6)', 'rgba(29, 99, 255, 0.3)'],

  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ['rgba(29, 99, 255, 1)', 'rgba(29, 99, 255, 0.6)', 'rgba(29, 99, 255, 0.3)'],
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
  },
  stroke: {
    width: 0,
  },
}

export default function UsersByDevicePieCart() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const cardColor = 'brand.neutral3'
  const cardShadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset')

  const [chartSeries, chartSeriesSet] = useState([])
  const [chartData, chartDataSet] = useState([])
  const [total, totalSet] = useState(0)

  const [isLoading, isLoadingSet] = useState(false)

  const getUsersByDevice = async (filterBy) => {
    isLoadingSet(true)
    const res = await axios
      .post(`/api/admin/analytics/users-by-type`, { filterBy })
      .then((r) => r.data)
      .catch((err) => console.log(err))

    if (res.isError) {
      // toast error
    } else {
      // need 1 array to map to, to display value outside of chart
      // need 1 array to be used as chart Data
      let temp = [],
        series = [],
        total = 0
      for (let i = 0; i < res.rows.length; i++) {
        const label = res.rows[i].dimensionValues[0].value
        const value = parseInt(res.rows[i].metricValues[0].value)

        temp.push({ label, value })
        series.push(value)
        total += parseInt(value)
      }
      chartSeriesSet([...series])
      chartDataSet(temp)
      totalSet(total)
    }
    isLoadingSet(false)
  }

  useEffect(() => {
    getUsersByDevice(THIS_YEAR)
  }, [])
  return (
    <Card px="0px" direction="column" w="100%" h="100%">
      <Flex px="25px" justifyContent="space-between" align="center" mb="1rem">
        <Heading fontSize="xl" fontWeight="700" lineHeight="24px">
          Users by Device
        </Heading>
        <Select
          h="24px"
          fontSize="sm"
          variant="subtle"
          defaultValue={THIS_YEAR}
          width="unset"
          fontWeight="700"
          onChange={(e) => getUsersByDevice(e.target.value)}
        >
          <option value={LAST_YEAR}>{LAST_YEAR}</option>
          <option value={THIS_YEAR}>{THIS_YEAR}</option>
        </Select>
      </Flex>
      {isLoading && (
        <Flex py="5px" h="100%" w="100%" justifyContent={'center'}>
          <Spinner size={'xl'} />
        </Flex>
      )}
      {chartData.length === 0 && !isLoading && (
        <Flex py="5px" h="100%" w="100%" justifyContent={'center'}>
          No historical data
        </Flex>
      )}
      {chartSeries?.length > 0 && !isLoading && (
        <>
          <ApexPieChart h="100%" w="100%" chartData={chartSeries} chartOptions={pieChartOptions} />
          <Card
            bg={cardColor}
            flexDirection="row"
            boxShadow={cardShadow}
            w="auto"
            p="15px"
            px="20px"
            mx="25px"
            mt="auto"
            gap="10px"
            justifyContent="space-around"
          >
            {chartData?.map((data, index) => {
              return (
                <Flex direction="column" py="5px" key={index}>
                  <Flex align="center">
                    <Box h="8px" w="8px" bg="brand.blue" borderRadius="50%" me="4px" />
                    <Text fontSize="xs" color="brand.neutral1" fontWeight="400" mb="5px">
                      {capitalizeFirstLetter(data.label)}
                    </Text>
                  </Flex>
                  <Heading fontSize="md" color={textColor} fontWeight="700" fontFamily={'Intern'}>
                    {((data.value / total) * 100).toFixed(0)}%
                  </Heading>
                </Flex>
              )
            })}
          </Card>
        </>
      )}
    </Card>
  )
}
