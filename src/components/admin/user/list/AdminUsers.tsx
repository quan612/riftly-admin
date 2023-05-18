import React, {  useMemo, useContext } from 'react'

import {
  Heading,
  Box,
  Flex,
  Text,
  Button,
  useColorModeValue,
  Checkbox,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Icon,
  ButtonGroup,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'

import { AdminBanner, AdminCard } from '@components/shared/Card'
import { useGlobalFilter, usePagination, useSortBy, useTable, useRowSelect } from 'react-table'
import { BsFilter } from 'react-icons/bs'
import {  FaFileCsv } from 'react-icons/fa'

import { shortenAddress } from '@util/index'
import Loading from '@components/shared/LoadingContainer/Loading'
import TablePagination from './TablePagination'
import RightSideBar from '@components/shared/RightSideBar'

import {
  DiscordIcon,
  EmailIcon,
  GoogleIcon,
  TransparentDiscordIcon,
  TransparentEmailIcon,
  TransparentGoogleIcon,
  TransparentTwiterIcon,
  TransparentWalletIcon,
  TwitterIcon,
  WalletIcon,
} from '@components/shared/Icons'

import moment from 'moment'
import AdminUserInfo from './AdminUserInfo'
import FilterUsersSidebar from './FilterUsersSidebar'
import { downloadCsv } from './helper'

import type Prisma from '@prisma/client'
import { UsersContext } from '@context/UsersContext'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { AiOutlineUser } from 'react-icons/ai'
import { FaEllipsisH } from 'react-icons/fa'
import axios from 'axios'
import Enums from '@enums/index'
import { useRouter } from 'next/router'

interface UsersBannerProps {
  downloadCsv?: () => void
}
const UsersBanner = ({ downloadCsv }: UsersBannerProps) => {
  const { allUsers, filterSidebar } = useContext(UsersContext)
  const router = useRouter()
  return (
    <AdminBanner>
      <Flex
        mb={{ sm: '10px', md: '0px' }}
        w={'100%'}
        textAlign={{ base: 'start' }}
        justifyContent="space-between"
      >
        <Flex direction="column" maxWidth="100%" my={{ base: '14px' }} gap="1rem">
          {allUsers && (
            <Heading fontSize={{ base: 'lg', lg: '3xl' }} color={'white'} fontWeight="700">
              {allUsers.length} Users
            </Heading>
          )}
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

          <Button
            variant="outline"
            leftIcon={
              <Icon
                transition="0.8s"
                color="green.400"
                boxSize={7}
                as={FaFileCsv}
                _hover={{
                  cursor: 'pointer',
                }}
              />
            }
            onClick={downloadCsv}
          >
            CSV
          </Button>
          <Button
            variant="blue"
            borderColor='white'
            leftIcon={<BsFilter color="white" />}
            onClick={filterSidebar.onOpen}
          >
            Filter Users
          </Button>
          <Menu >
            <MenuButton as={Button} variant='blue' maxW='150px' borderColor='white' size='sm'>
              Add User
            </MenuButton>

            <MenuList>
              <MenuItem onClick={() => router.push('/user/add')}> Single</MenuItem>
              <MenuItem onClick={() => router.push('/user/bulk')}> Bulk</MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Flex>
    </AdminBanner>
  )
}

export default function AdminUsers() {
  const { isLoadingUserStats, filterUsers } = useContext(UsersContext)

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
      {isLoadingUserStats && <Loading />}
      {filterUsers && <ResultTable data={filterUsers} />}
    </Flex>
  )
}

const ResultTable = ({ data }) => {
  const { filterSidebar, userSidebar, userDetails, viewUserDetails } = useContext(UsersContext)

  const columns = useMemo(
    () => columnData,
    [
    ],
  )
  const tableData = useMemo(() => data, [data])

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method to render a checkbox
          Header: ({
            isAllRowsSelected,
            toggleAllRowsSelected,
            getToggleAllRowsSelectedProps,
            selectedFlatRows,
          }) => {
            return (
             

              <Menu>
                <MenuButton
                  as={Button}
                  variant="blue"
                  size="sm"
                  p='0px !important'
                  pe="0.1rem !important"
                  ps="0.1rem !important"
                  h="32px"
                  w="90px"
                  fontSize="sm"
                  fontWeight="400"
                  color={'white'}
                  borderRadius="32px"
                >
                  <ChevronDownIcon w="6" h="5" />
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      toggleAllRowsSelected(isAllRowsSelected ? false : true)
                    }}
                  >
                    Toogle Select
                  </MenuItem>
                  <MenuItem
                    isDisabled={selectedFlatRows.length === 0}
                    onClick={async () => {
                      const selectedRows = selectedFlatRows
                        .filter((r) => {
                          const whiteListUserData = r.original.whiteListUserData
                          if (whiteListUserData) {
                            const { lastEthUpdated, eth } = whiteListUserData
                            if (lastEthUpdated) {
                              const hourPast = moment(new Date()).diff(
                                moment(lastEthUpdated),
                                'hours',
                                false,
                              )

                              if (eth < 0.02 && hourPast > 96) {
                                // if the last time is 0, may not need to update again, using a diffent route to update all
                                return true
                              }
                              if (eth < 0.02 && hourPast < 96) {
                                return false
                              }

                              if (hourPast < 12) {
                                console.log('Not selecting this row as the data too current')
                                return false
                              }
                            }
                          }
                          if (r?.original?.wallet?.length > 0) {
                            return true
                          }
                          return false
                        })
                        .map((r) => {
                          return {
                            wallet: r.original.wallet,
                            userId: r.original.userId,
                          }
                        })
                      if (selectedFlatRows.length > 0 && selectedRows.length === 0) {
                        return alert(`No operation as data just updated.`)
                      }

                      if (
                        selectedRows.length >= 100 &&
                        !confirm(`Performing on large dataset of ${selectedRows.length} rows?`)
                      ) {
                        return
                      }

                      if (selectedRows.length > 0) {
                        const skip = Enums.UPDATE_SKIP

                        let chunkSplit = []

                        for (let i = 0; i < selectedRows.length; i += skip) {
                          chunkSplit = [...chunkSplit, selectedRows.slice(i, i + skip)]
                        }

                        for (const chunk of chunkSplit) {
                          const payload = { selectedRows: chunk }

                          await axios
                            .post(`/api/admin/user/update-users-eth`, payload)
                            .then((r) => r.data)
                        }
                      }
                    }}
                  >
                    Update ETH
                  </MenuItem>
                  <MenuItem
                    isDisabled={selectedFlatRows.length === 0}
                    onClick={async () => {
                      const selectedRows = selectedFlatRows
                        .filter((r) => {
                          const whiteListUserData = r.original.whiteListUserData

                          if (whiteListUserData) {
                            const { lastFollowersUpdated, followers } = whiteListUserData
                            if (lastFollowersUpdated) {
                              const hourPast = moment(new Date()).diff(
                                moment(lastFollowersUpdated),
                                'hours',
                                false,
                              )
                              if (followers === 0 && hourPast > 96) {
                                // if the last time is 0, may not need to update again, using a diffent route to update all
                                return true
                              }
                              if (followers === 0 && hourPast < 96) {
                                return false
                              }

                              if (hourPast < 24) {
                                console.log('Not selecting this row as the data too current')
                                return false
                              }
                            }
                          }
                          if (r?.original?.twitterId?.length > 0) {
                            return true
                          }
                          return false
                        })
                        .map((r) => {
                          return {
                            twitterId: r.original.twitterId,
                            userId: r.original.userId,
                          }
                        })

                      if (selectedFlatRows.length > 0 && selectedRows.length === 0) {
                        return alert(`No operation as data just updated.`)
                      }

                      if (
                        selectedRows.length > 0 &&
                        confirm(`Performing on large dataset of ${selectedRows.length} rows?`)
                      ) {
                        const skip = Enums.UPDATE_SKIP

                        let chunkSplit = []

                        for (let i = 0; i < selectedRows.length; i += skip) {
                          chunkSplit = [...chunkSplit, selectedRows.slice(i, i + skip)]
                        }

                        for (const chunk of chunkSplit) {
                          const payload = { selectedRows: chunk }
                          await axios.post(`/api/admin/user/update-users-followers`, payload)
                        }
                      }
                    }}
                  >
                    Update Followers
                  </MenuItem>
                  <MenuItem isDisabled={true} onClick={() => {}}>
                    placeholder
                  </MenuItem>
                </MenuList>
              </Menu>
            )
          },
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    },
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

  const getRowProps = (row) => ({
    style: {
      background: 'rgba(47, 78, 109, 0.5)',
      borderRadius: '20px',
    },
  })

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
        isOpen={filterSidebar.isOpen}
        onClose={filterSidebar.onClose}
        title="Filter Users"
      >
        <FilterUsersSidebar />
      </RightSideBar>
      <RightSideBar isOpen={userSidebar.isOpen} onClose={userSidebar.onClose} title="User Info">
        <AdminUserInfo userDetails={userDetails} />
      </RightSideBar>
      <UsersBanner
        downloadCsv={() => {
          const jsonData = rows.map((row) => {
            prepareRow(row)

            return row.original
          })

          downloadCsv(jsonData)
        }}
      />
      <Box w="100%" mb="2rem">
        <AdminCard>
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
                    // console.log(column);
                    if (column.id === 'selection') {
                      return (
                        <Th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          w='95px'
                          p="0"
                          key={index}
                        >
                          {column.render('Header')}
                        </Th>
                      )
                    }
                    return (
                      <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        key={index}
                        borderColor={borderColor}
                        pe="0.25rem"
                        ps="0.25rem"
                      >
                        {!column?.hideHeader && (
                          <Flex
                            align="center"
                            fontSize={{ base:'10px', lg: '14px' }}
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
                     

                      if (cell.column.id === 'selection') {
                        return (
                          <Td
                            {...cell.getCellProps()}
                            border="1px solid transparent"
                            borderLeftRadius="20px"
                            pe={'0.5rem'}
                            key={index}
                          >
                            {cell.render('Cell')}
                          </Td>
                        )
                      }

                      const data = getCellValue(cell, viewUserDetails)

                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: '14px' }}
                          maxW={{ sm: '150px', md: '200px', lg: '200px' }}
                          border="1px solid transparent"
                          borderLeftRadius={`${index === 0 ? '20px' : '0px'}`}
                          borderRightRadius={`${index === row.cells.length - 1 ? '20px' : '0px'}`}
                          pe={'0.25rem'}
                          ps={'0.25rem'}
                        >
                          {data}
                          {/* {cell.render("Cell")} */}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
          <Flex>
            {tableInstance?.pageOptions?.length > 0 && (
              <TablePagination tableInstance={tableInstance} />
            )}
          </Flex>
        </AdminCard>
      </Box>
    </Flex>
  )
}

const getUsername = (userObj: Prisma.WhiteList) => {
  const { email, discordUserDiscriminator, twitterUserName, wallet, avatar } = userObj

  let username;
  if(wallet){
    username = shortenAddress(wallet)
  }
  else if(email){
    username = email
  }
  else if(discordUserDiscriminator){
    username = discordUserDiscriminator
  }
  else if(twitterUserName){
    username = twitterUserName
  }
 
  return (
    <Flex alignItems={'center'} gap={{ base: '8px', lg: '1rem' }}>
      <Box>
        <Avatar
          size="sm"
          bg="rgba(47, 78, 109, 1)"
          icon={<AiOutlineUser fontSize="1.25rem" color="rgba(19, 36, 54, 1)" />}
          src={avatar}
        />
      </Box>
      <Heading color="white" fontSize={'md'} minWidth="120px" isTruncated>
        {username } 
      </Heading>
    </Flex>
  )
}

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = React.useRef()
  const resolvedRef = ref || defaultRef

  React.useEffect(() => {
    if (resolvedRef) {
      // resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate])

  const { checked, onChange } = rest
  return (
    <>
      <Checkbox
        isChecked={checked}
        onChange={onChange}
      />
    </>
  )
})

// this function manipulat the style, sometimes in ancessor its impossible to return the
// value straightaway for sorting purpose
const getCellValue = (cell, viewUserDetails) => {
  const { email, discordUserDiscriminator, twitterUserName, wallet, google, userId } = cell.row.original
  const day = Math.floor(cell.value / 24)
  const color = day <= 4 ? 'orange.300' : 'red.300'

  let value = cell.value
  if (typeof cell.value === 'number') {
    value = value.toLocaleString('en-US')
  }

  switch (cell.column.Header) {
    case 'TIER':
      return (
        <Text color="white"  >
          5
        </Text>
      )
     
    case 'LAST ACTIVE':
      if (value < 24) {
        return (
          <Text color="green.300" >
            {value} hrs
          </Text>
        )
      }

      if (value === 24) {
        return (
          <Text color="green.300" >
            1 day
          </Text>
        )
      }
     
      return (
        <Text color={color} >
          {Math.floor(cell.value / 24)} days
        </Text>
      )

    case 'ACTION':
      return (
        <Box>
          <Menu>
            <MenuButton>
              <Icon
                as={FaEllipsisH}
                boxSize={{ base: 4, lg: 6 }}
                cursor="pointer"
                color="brand.neutral1"
              />
            </MenuButton>

            <MenuList>
              <MenuItem onClick={() => viewUserDetails(cell.row.original)}>User Details</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      )

    case 'USER':
      return getUsername(cell.row.original)
    case 'CONNECTIONS':
   
      return (
        <Flex gap={{ base: '5px', lg: '8px' }}>
          <Box boxSize={'18px'}>
            {email && <EmailIcon />}
            {!email && <TransparentEmailIcon />}
          </Box>
          <Box boxSize={'18px'}>
            {google && <GoogleIcon />}
            {!google && <TransparentGoogleIcon />}
          </Box>
          <Box boxSize={'18px'}>
            {discordUserDiscriminator && <DiscordIcon />}
            {!discordUserDiscriminator && <TransparentDiscordIcon />}
          </Box>
          <Box boxSize={'18px'}>
            {twitterUserName && <TwitterIcon />}
            {!twitterUserName && <TransparentTwiterIcon />}
          </Box>
          <Box boxSize={'18px'}>
            {wallet && <WalletIcon />}
            {!wallet && <TransparentWalletIcon />}
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
const columnData = [
  {
    Header: 'USER',
    accessor: 'user',
    disableSortBy: true,
  },
  {
    Header: 'TIER',
    accessor: 'tier',
  },
  {
    Header: 'POINTS',
    accessor: (row) => {
      const rewardValue = row?.rewards?.find((e) => e?.rewardType?.reward === 'Points')
      return rewardValue?.quantity 
    },
  },
  {
    Header: 'LAST ACTIVE',
    accessor: (row) => {
      const lastFinishedQuestDaytime = row?.userQuest[0]?.updatedAt || row?.updatedAt
      const hourPast = moment(new Date()).diff(moment(lastFinishedQuestDaytime), 'hours', false)

      return hourPast // to be manipulate later
    },
  },
  {
    Header: 'CONNECTIONS',
    accessor: 'connections',
    disableSortBy: true,
  },
  {
    Header: 'FOLLOWS',
    accessor: (row) => row?.whiteListUserData?.followers || 0,
  },
  {
    Header: 'NET',
    accessor: (row) => row?.whiteListUserData?.eth || 0,
  },
  {
    Header: 'ACTION',
    accessor: 'action',
    disableSortBy: true,
    hideHeader: true,
  },
]