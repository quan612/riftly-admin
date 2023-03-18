import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
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
import { AdminBanner, AdminCard } from '@components/shared/Card'
import { useGlobalFilter, usePagination, useSortBy, useTable, useRowSelect } from 'react-table'

import {
  useAdminQuestSoftDelete,
  useAdminQuestsQuery,
  useAdminQuestUpsert,
} from '@hooks/admin/quest'
import RightSideBar from '@components/shared/RightSideBar'
import NewQuestModal from './NewQuestModal'
import moment from 'moment'

import { AddIcon, ChevronDownIcon, SmallAddIcon } from '@chakra-ui/icons'
import {
  DeleteIcon,
  EditIcon,
  PauseIcon,
  RiftlyCheckMark,
  RiftlyEditIcon,
} from '@components/shared/Icons'
import { capitalizeFirstLetter } from '@util/index'

import { QuestStyle, QuestDuration } from '@prisma/client'
import { useAdminAllUsersCountQuery } from '@hooks/admin/user'
import { FaPlay } from 'react-icons/fa'

const AdminQuestsBanner = ({ count, onAddNew }) => {
  return (
    <AdminBanner>
      <Flex
        mb={{ sm: '10px', md: '0px' }}
        w={'100%'}
        textAlign={{ base: 'start' }}
        justifyContent="space-between"
      >
        <Flex direction="column" maxWidth="100%" my={{ base: '14px' }} gap="1rem">
          {/* {allUsers && ( */}
          <Heading fontSize={{ base: 'lg', lg: '3xl' }} color={'white'} fontWeight="700">
            {count} Active Quests
          </Heading>
          {/* )} */}
          <Text fontSize={'lg'} color={'white'} fontWeight="400">
            Last updated: {moment(new Date()).format('MMM dd, hh:mm A')}{' '}
            {new Date()
              .toLocaleDateString(undefined, {
                day: '2-digit',
                timeZoneName: 'short',
              })
              .substring(4)}
          </Text>
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
          {/* <Button
            variant="blue"
            borderColor={'white'}
            leftIcon={<BsFilter size={'20px'} color="white" />}
            // onClick={filterSidebar.onOpen}
          >
            Filter
          </Button> */}
          <Button
            variant="blue"
            borderColor={'white'}
            leftIcon={<AddIcon boxSize={'16px'} />}
            onClick={onAddNew}
          >
            Add Quest
          </Button>
        </ButtonGroup>
      </Flex>
    </AdminBanner>
  )
}

const CurrentQuests = () => {
  const { data: quests, isLoading: isLoadingQuests } = useAdminQuestsQuery()
  const { data: usersCount, isLoading: isFetchingUsersCount } = useAdminAllUsersCountQuery()

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
      <RightSideBar
        // isOpen={filterSidebar.isOpen}
        // onClose={filterSidebar.onClose}
        title="Filter Quests"
      >
        {/* <FilterUsersSidebar /> */}
      </RightSideBar>

      {quests && quests.length > 0 && usersCount && (
        <ResultTable data={quests} usersCount={usersCount} />
      )}
    </Flex>
  )
}

const ResultTable = ({ data, usersCount }) => {
  const newQuestModal = useDisclosure()
  // const { filterSidebar, userSidebar, userDetails, viewUserDetails } = useContext(UsersContext)
  const router = useRouter()
  const columnData = [
    {
      Header: 'QUEST',
      accessor: 'text',
      disableSortBy: true,
    },
    {
      Header: 'DESCRIPTION',
      accessor: 'description',
    },
    {
      Header: 'POINTS',

      accessor: 'quantity',
    },
    {
      Header: 'STYLE',
      accessor: 'style',
    },

    {
      Header: 'ACTIVE DATE',
      accessor: 'active date',
    },
    {
      Header: 'COMPLETION RATE',
      accessor: (row) => {
        const {
          _count: { userQuests },
        } = row
        if (usersCount) return ((userQuests / usersCount) * 100).toFixed(0)
      },
    },

    {
      Header: 'ACTION',
      accessor: 'action',
      disableSortBy: true,
      hideHeader: true,
    },
  ]
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

  const { isLoading: upsertingQuest, mutateAsync } = useAdminQuestUpsert()
  const [deleteQuest, deletingQuest, handleOnDelete] = useAdminQuestSoftDelete()

  const getRowProps = (row) => ({
    style: {
      background: 'rgba(47, 78, 109, 0.5)',
      borderRadius: '20px',
    },
  })

  const editQuestAction = useCallback((id) => {
    router.push(`/quest/edit?id=${id}`)
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
      {/* <RightSideBar
        isOpen={filterSidebar.isOpen}
        onClose={filterSidebar.onClose}
        title="Filter Users"
      >
        <FilterUsersSidebar />
      </RightSideBar>
      <RightSideBar isOpen={userSidebar.isOpen} onClose={userSidebar.onClose} title="User Info">
        <AdminUserInfo userDetails={userDetails} />
      </RightSideBar> */}
      <NewQuestModal
        isOpen={newQuestModal.isOpen}
        onClose={() => {
          newQuestModal.onClose()
        }}
      />
      <AdminQuestsBanner
        count={data?.length}
        onAddNew={() => {
          newQuestModal.onOpen()
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
                      const data = getCellValue(
                        cell,
                        usersCount,
                        editQuestAction,
                        mutateAsync,
                        handleOnDelete,
                      )

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
          <Flex>
            {/* {tableInstance?.pageOptions?.length > 0 && (
              <TablePagination tableInstance={tableInstance} />
            )} */}
          </Flex>
        </AdminCard>
      </Box>
    </Flex>
  )
}

const getActiveDateColor = (startDate, endDate) => {
  if (endDate > new Date()) {
    return 'brand.neutral2'
  }
  const dayPast = moment.utc(new Date()).diff(moment.utc(endDate, 'MM/DD/yyyy'), 'days', false)

  if (Math.abs(dayPast) > 1) {
    return 'red.300'
  }
  if (Math.abs(dayPast) > 5) {
    return 'yellow.300'
  }
  if (Math.abs(dayPast) > 10) {
    return 'green.300'
  }
  return 'white'
}

const getCellValue = (cell, usersCount, editQuestAction, mutateAsync, handleOnDelete) => {
  const {
    id,
    type,
    description,
    text,
    completedText,
    rewardTypeId,
    quantity,
    isEnabled,
    isRequired,
    extendedQuestData,
    duration,
    image,
    style,
    _count: { userQuests: questsDone },
  } = cell.row.original

  const day = Math.floor(cell.value / 24)
  const color = day <= 4 ? 'orange.300' : 'red.300'

  let value = cell.value
  if (typeof cell.value === 'number') {
    value = value.toLocaleString('en-US')
  }

  switch (cell.column.Header) {
    case 'QUEST':
      return (
        <Text maxW="250px" noOfLines={2}>
          {value}
        </Text>
      )
    case 'DESCRIPTION':
      return (
        <Text maxW="250px" noOfLines={2}>
          {value}
        </Text>
      )
    case 'STYLE':
      return (
        <Text fontSize={'md'} color={`${value === QuestStyle.FEATURED ? 'yellow.300' : 'white'}`}>
          {capitalizeFirstLetter(value)}
        </Text>
      )
    case 'ACTIVE DATE':
      if (duration === QuestDuration.ONGOING)
        return (
          <Text fontSize={'md'} color={'green.300'}>
            {capitalizeFirstLetter(duration)}
          </Text>
        )
      else {
        return (
          <Flex
            gap="4px"
            color={getActiveDateColor(extendedQuestData?.startDate, extendedQuestData?.endDate)}
          >
            <Text as={'span'} minW="90px">
              {moment.utc(extendedQuestData?.startDate, 'MM/DD/yyyy').format('MMM DD')}-
              {moment.utc(extendedQuestData?.endDate, 'MM/DD/yyyy').format('MMM DD')}
            </Text>
          </Flex>
        )
      }
    case 'COMPLETION RATE':
      return (
        <Flex align="center" justifyContent={'space-between'} gap="6px">
          <Text color={'white'} fontSize="sm" fontWeight="400">
            {value}%
          </Text>
          <Progress
            colorScheme="blue"
            h="8px"
            w="108px"
            value={((questsDone / usersCount) * 100).toFixed(0)}
          />
        </Flex>
      )

    case 'ACTION':
      return (
        <Flex align="center" justify="center" gap="6px">
          <Box
            boxSize={{ base: '16px', xl: '24px' }}
            onClick={async () => {
              //set to enable false
              let res = await mutateAsync({
                id,
                type: type.name, // get type name from type object
                description,
                text,
                completedText,
                rewardTypeId,
                quantity,
                isEnabled: isEnabled ? false : true,
                isRequired,
                extendedQuestData,
                duration,
                image,
                style,
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
              editQuestAction(id)
            }}
            color="#89A4C2"
            _hover={{ cursor: 'pointer', color: '#00BBC7' }}
          >
            <EditIcon />
          </Box>

          <Box
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
          </Box>
        </Flex>
      )
    default:
      return (
        <Text color="white" fontSize={'lg'}>
          {value}
        </Text>
      )
  }
}

export default CurrentQuests
