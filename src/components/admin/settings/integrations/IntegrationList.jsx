import React, { useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react'
import Enums from 'enums'
import { useRouter } from 'next/router'

import {
  Heading,
  Box,
  Flex,
  Text,
  Button,
  useColorModeValue,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  useToast,
  ButtonGroup,
  useDisclosure,
  Progress,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { useGlobalFilter, usePagination, useSortBy, useTable, useRowSelect } from 'react-table'

import {
  useAdminQuestSoftDelete,
  useAdminQuestsQuery,
  useAdminQuestUpsert,
} from '@hooks/admin/quest'

import moment from 'moment'

import { DeleteIcon, EditIcon, PauseIcon } from '@components/shared/Icons'
import { capitalizeFirstLetter } from '@util/index'

import { QuestStyle, QuestDuration, ItemType } from '@prisma/client'

import { FaPlay } from 'react-icons/fa'
import Banner from './Banner'
import Loading from '@components/shared/LoadingContainer/Loading'

import { useShopItemPause } from '@hooks/admin/shop-item'
import { IntegrationItemsContext } from '@context/IntegrationItemsContext'
import { IntegrationType } from '@models/integration-type'

const IntegrationList = () => {
  const { webhookItems, isLoadingWebhookItems } = useContext(IntegrationItemsContext)
  console.log(webhookItems)
  return (
    <Flex flexDirection="column" w="100%" h="100%" justifyContent="center" gap="20px">
      {isLoadingWebhookItems && <Loading />}
      {webhookItems && <ResultTable data={webhookItems} />}
    </Flex>
  )
}

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
  const [deleteQuest, deletingQuest, handleOnDelete] = useAdminQuestSoftDelete()

  const getRowProps = (row) => ({
    style: {
      background: 'rgba(47, 78, 109, 0.5)',
      borderRadius: '20px',
    },
  })

  const editAction = useCallback((id) => {
    router.push(`/setting/webhook/edit?id=${id}`)
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
          router.push(`/setting/webhook/add`)
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
                            justify={'left'}
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
            <Tbody {...getTableBodyProps()} gap="12px">
              {page.map((row, index) => {
                prepareRow(row)

                return (
                  <Tr {...row.getRowProps(getRowProps(row))} key={index}>
                    {row.cells.map((cell, index) => {
                      const data = getCellValue(cell, editAction, pauseShopItemAsync)

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
          <Flex></Flex>
        </AdminCard>
      </Box>
    </Flex>
  )
}

const columnData = [
  {
    Header: 'DESCRIPTION',
    accessor: 'description',
  },
  {
    Header: 'URL',
    accessor: 'url',
  },
  {
    Header: 'TYPE',
    accessor: 'type',
  },
  {
    Header: 'EVENT',
    accessor: 'event',
  },
  {
    Header: 'ACTION',
    accessor: 'action',
    disableSortBy: true,
    hideHeader: true,
  },
]

const getCellValue = (cell, editAction, pauseShopItemAsync) => {
  const { id, url, description, type, eventId, associated } = cell.row.original

  let value = cell.value
  if (typeof cell.value === 'number') {
    value = value.toLocaleString('en-US')
  }

  switch (cell.column.Header) {
    case 'DESCRIPTION':
      return (
        <Text noOfLines={2} textAlign="left">
          {value}
        </Text>
      )
    case 'EVENT':
      if (type === IntegrationType.QUEST_ITEM)
        return (
          <Text noOfLines={2} textAlign="left">
            {associated.text}
          </Text>
        )

      if (type === IntegrationType.SHOP_ITEM)
        return (
          <Text noOfLines={2} textAlign="left">
            {associated.title}
          </Text>
        )
    case 'ACTION':
      return (
        <Flex align="center" justify="center" gap="6px">
          {/* <Box
            boxSize={{ base: '16px', xl: '24px' }}
            onClick={async () => {
              //set to enable false
              let res = await pauseShopItemAsync({
                id,
                isEnabled: isEnabled ? false : true,
              })
            }}
            color="#89A4C2"
            _hover={{ cursor: 'pointer', color: '#00BBC7' }}
          >
            {isEnabled ? <PauseIcon /> : <FaPlay />}
          </Box> */}
          <Box
            boxSize={{ base: '16px', xl: '24px' }}
            onClick={() => {
              editAction(id)
            }}
            color="#89A4C2"
            _hover={{ cursor: 'pointer', color: '#00BBC7' }}
          >
            <EditIcon />
          </Box>

          {/* <Box
            boxSize={{ base: '16px', xl: '24px' }}
            onClick={() => {
              console.log('to delete')

              if (confirm(`Deleting this quest "${text}" ?`)) {
                handleOnDelete({ id })
              }
            }}
            color="#89A4C2"
            _hover={{ cursor: 'pointer', color: 'red.300' }}
          >
            <DeleteIcon />
          </Box> */}
        </Flex>
      )
    default:
      return (
        <Text color="white" fontSize={'lg'} textAlign="left">
          {value}
        </Text>
      )
  }
}

export default IntegrationList
