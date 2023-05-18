import React, { useMemo, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'

import { EditIcon, PauseIcon } from '@components/shared/Icons'

import { ItemType } from '@prisma/client'

import { FaPlay } from 'react-icons/fa'
import Banner from './Banner'
import Loading from '@components/shared/LoadingContainer/Loading'
import { ShopItemsContext } from '@context/ShopItemsContext'
import { useShopItemPause } from '@hooks/admin/shop-item'

const ShopItemList = () => {
  const { shopItems, isLoadingShopItems } = useContext(ShopItemsContext)
  return (
    <Flex flexDirection="column" w="100%" h="100%" justifyContent="center" gap="20px">
      {isLoadingShopItems && <Loading />}
      {shopItems && <ResultTable data={shopItems} />}
    </Flex>
  )
}

const columnData = [
  {
    Header: 'ITEM',
    accessor: 'title',
  },
  {
    Header: 'DESCRIPTION',
    accessor: 'description',
  },
  {
    Header: 'COST',
    accessor: 'cost',
  },
  {
    Header: 'REDEEMED / AVAILABLE',
    accessor: 'redeemAvailable',
  },
  {
    Header: 'CONTRACT TYPE',
    accessor: 'contractType',
  },
  {
    Header: 'ACTION',
    accessor: 'action',
    disableSortBy: true,
    hideHeader: true,
  },
]

const ResultTable = ({ data }) => {
  const router = useRouter()

  const columns = useMemo(
    () => columnData,
    [
      // columnData
    ],
  )
  const tableData = useMemo(() => data, [data])

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        pageSize: 100,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows, //this give filtered rows
    prepareRow,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = tableInstance

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')

  const {
    data: shopItemData,
    isLoading: pausingShopItem,
    mutateAsync: pauseShopItemAsync,
  } = useShopItemPause()

  const getRowProps = (row) => ({
    style: {
      background: 'rgba(47, 78, 109, 0.5)',
      borderRadius: '20px',
    },
  })

  const editShopAction = useCallback((id) => {
    router.push(`/reward/shop/edit?id=${id}`)
  }, [])

  return (
    <Flex
      flexDirection={{
        base: 'column',
      }}
      w="100%"
      h="100%"
      justifyContent="center"
      gap="20px"
    >
      <Banner
        count={data?.length}
        onAddNew={() => {
          router.push(`/reward/shop/add`)
        }}
      />
      <Box w="100%" mb="2rem">
        <AdminCard p="16px">
          <Table
            variant="simple"
            style={{
              borderCollapse: 'separate',
              borderSpacing: '0 1em',
            }}
          >
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => {
                    return (
                      <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        key={index}
                        borderColor={borderColor}
                        pe="0.5rem"
                        ps="1rem"
                      >
                        {!column?.hideHeader && (
                          <Flex
                            justify={'center'}
                            align="center"
                            fontSize={{ sm: '8px', lg: '12px', xl: '14px' }}
                            color="gray.400"
                            gap="8px"
                            fontWeight={'400'}
                          >
                            {column.render('Header')}

                            {column.isSorted && !column.isSortedDesc && <span>▼</span>}
                            {column.isSorted && column.isSortedDesc && <span>▲</span>}
                          </Flex>
                        )}
                      </Th>
                    )
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row)

                return (
                  <Tr {...row.getRowProps(getRowProps(row))} key={index}>
                    {row.cells.map((cell, index) => {
                      const data = getCellValue(cell, editShopAction, pauseShopItemAsync)

                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: '14px' }}
                          maxW={{ sm: '125px', md: '150px', lg: '225px' }}
                          border="1px solid transparent"
                          borderLeftRadius={`${index === 0 ? '20px' : '0px'}`}
                          borderRightRadius={`${index === row.cells.length - 1 ? '20px' : '0px'}`}
                          pe={'0.5rem'}
                          ps={'1rem'}
                        >
                          {data}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </AdminCard>
      </Box>
    </Flex>
  )
}

const getCellValue = (cell, editShopAction, pauseShopItemAsync) => {
  const { id, title, description, isEnabled, itemType, contractType, available, redeemAvailable } =
    cell.row.original

  const day = Math.floor(cell.value / 24)
  const color = day <= 4 ? 'orange.300' : 'red.300'

  let value = cell.value
  if (typeof cell.value === 'number') {
    value = value.toLocaleString('en-US')
  }

  let redeemCal, redeemColor

  switch (cell.column.Header) {
    case 'ITEM':
      return (
        <Text noOfLines={2} textAlign="center">
          {value}
        </Text>
      )
    case 'DESCRIPTION':
      return (
        <Text noOfLines={2} textAlign="center">
          {value}
        </Text>
      )
    case 'CONTRACT TYPE':
      if (itemType === ItemType.OFFCHAIN) {
        return (
          <Text textAlign="center" fontSize={'md'}>
            N/A
          </Text>
        )
      } else
        return (
          <Text textAlign="center" fontSize={'md'}>
            {contractType.toUpperCase()}
          </Text>
        )
    case 'REDEEMED / AVAILABLE':
      redeemCal = (available - redeemAvailable) / available
      redeemColor = 'green.300'
      if (redeemCal > 0.9) {
        redeemColor = 'red.300'
      } else if (redeemCal > 0.5) {
        redeemColor = 'orange.300'
      }
      return (
        <Flex fontSize={'md'} justify={'center'} w="100%">
          <Text as={'span'} color={redeemColor}>
            {available - redeemAvailable}{' '}
          </Text>
          <Text as={'span'} color={'brand.neutral1'} ml="0.25rem">
            / {available}
          </Text>
        </Flex>
      )
    case 'ACTION':
      return (
        <Flex align="center" justify="center" gap="6px">
          <Box
            boxSize={{ base: '16px', xl: '24px' }}
            onClick={async () => {
              await pauseShopItemAsync({
                id,
                isEnabled: isEnabled ? false : true,
              })
            }}
            color="#89A4C2"
            _hover={{ cursor: 'pointer', color: '#00BBC7' }}
          >
            {isEnabled ? <PauseIcon /> : <FaPlay />}
          </Box>
          <Box
            boxSize={{ base: '16px', xl: '24px' }}
            onClick={() => {
              editShopAction(id)
            }}
            color="#89A4C2"
            _hover={{ cursor: 'pointer', color: '#00BBC7' }}
          >
            <EditIcon />
          </Box>
        </Flex>
      )
    default:
      return (
        <Text color="white" fontSize={'lg'} textAlign="center">
          {value}
        </Text>
      )
  }
}

export default ShopItemList
