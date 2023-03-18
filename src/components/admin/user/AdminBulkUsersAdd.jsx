import React, { useState, useRef } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'

import { utils } from 'ethers'
import { read, utils as excelUtils } from 'xlsx'
import {
  ButtonGroup,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  Link,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  GridItem,
  Flex,
  Select,
  Box,
} from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { CheckSvg, CrossSvg, RiftlyCheckMark } from '@components/shared/Icons'
import { useAdminAddManyUsers } from '@hooks/admin/user'
import HalfPageWrapper from '../layout/HalfPageWrapper'
import { HeadingLg, TextMd } from '@components/shared/Typography'
import Enums from '@enums/index'
import { sortByFalseFirst } from '@util/sort'

/**Remove formik here, we dont do anything related to formik here */
const AdminBulkUsersAdd = () => {
  const toast = useToast()
  const [newUsersData, isAdding, bulkUsersAsync] = useAdminAddManyUsers()
  const [usersArray, usersArraySet] = useState([])
  const hiddenFileInput = useRef(null)

  const [inputFile, setInputFile] = useState(null)
  const textColor = useColorModeValue('gray.700', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  function handleOnLoadFile(e, setFieldValue) {
    if (!e.target.files[0]) {
      return
    }
    const reader = new FileReader()

    reader.readAsBinaryString(e.target.files[0])
    reader.onload = function (onLoadEvent) {
      let data = onLoadEvent.target.result
      let workbook = read(data, { type: 'string', raw: true })

      let currentWorkBook = workbook.Sheets[workbook.SheetNames[0]]

      let arrayData = excelUtils.sheet_to_json(currentWorkBook).map((r) => {
        let value = Object.values(r)[0]
        return { wallet: value, isValid: utils.isAddress(value) }
      })

      usersArraySet(arrayData)
    }
    setInputFile(e.target.files[0])
    e.target.value = ''
  }
  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      // onSubmit={onSubmit}
    >
      {({ errors, status, touched, setFieldValue, resetForm, dirty }) => (
        <Form>
          <HalfPageWrapper>
            <AdminCard py="8">
              <Flex direction="column" gap="20px">
                <HeadingLg>Bulk Users</HeadingLg>
                <TextMd color="brand.neutral2">
                  Add users in bulk by downloading our template in .csv format and uploading the
                  completed file.
                </TextMd>

                <FormControl>
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    Account Type
                  </FormLabel>
                  <Field name="type" as={Select} fontSize="md" ms="4px" size="lg">
                    <option value={Enums.WALLET}>{Enums.WALLET}</option>
                    {/* <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                        <option value={Enums.TWITTER}>{Enums.TWITTER}</option> */}
                  </Field>
                </FormControl>

                <FormControl>
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    Bulk User File
                  </FormLabel>
                  <ButtonGroup gap="16px" display={'flex'}>
                    <Link
                      flex="1"
                      href={`data:csv;charset=utf-8,${encodeURIComponent(getTemplate())}`}
                      download={`User Wallets Bulk.csv`}
                    >
                      <Button variant="outline-blue" w="100%">
                        Template File
                      </Button>
                    </Link>

                    <Button
                      onClick={() => {
                        hiddenFileInput.current.click()
                      }}
                      flex="1"
                      variant="blue"
                    >
                      Choose File
                    </Button>
                  </ButtonGroup>
                </FormControl>

                <input
                  type="file"
                  name="file"
                  accept="text/csv"
                  style={{ display: 'none' }}
                  ref={hiddenFileInput}
                  onChange={(e) => handleOnLoadFile(e, setFieldValue)}
                />
              </Flex>
            </AdminCard>

            {usersArray && usersArray.length > 0 && (
              <AdminCard py="8">
                <Flex
                  direction={'column'}
                  align="center"
                  justify="center"
                  bg={'brand.neutral5'}
                  border="2px dashed"
                  borderColor={'rgba(255, 255, 255, 0.1)'}
                  borderRadius="16px"
                  w="100%"
                  py="24px"
                >
                  <Box
                    overflowY="auto"
                    css={{
                      '&::-webkit-scrollbar': {
                        width: '10px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#2F4E6D',
                        width: '12px',
                        borderRadius: '24px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        height: '60px',
                        background: '#1D63FF',
                        borderRadius: '24px',
                      },
                    }}
                    maxHeight="300px"
                    w="95%"
                  >
                    <Table variant="simple">
                      <Thead>
                        <Tr my=".8rem" color="gray.400">
                          <Th pl="0" borderColor={borderColor} color="gray.400" fontSize={'md'}>
                            Wallet
                          </Th>
                          <Th pe="0" borderColor={borderColor} color="gray.400" fontSize={'md'}>
                            Is Valid
                          </Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {usersArray.sort(sortByFalseFirst).map((row, index) => {
                          return (
                            <Tr key={index}>
                              <Td
                                pl="0"
                                color={`${usersArray[index].isValid ? 'white' : 'red.300'}`}
                              >
                                {usersArray[index].wallet}
                              </Td>
                              <Td pe="0">
                                {usersArray[index].isValid && <CheckSvg />}
                                {!usersArray[index].isValid && <CrossSvg />}
                              </Td>
                            </Tr>
                          )
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </Flex>

                {inputFile && (
                  <Text color="brand.neutral2" align={'center'}>
                    {inputFile.name}
                  </Text>
                )}

                {status && <Text color={'red.300'}>API error: {status} </Text>}

                <ButtonGroup mt="16px" display="flex" gap="16px">
                  <Button
                    flex="1"
                    variant="blue"
                    disabled={usersArray.length === 0 || !dirty}
                    onClick={async () => {
                      setInputFile(null)
                      let payload = {
                        usersArray,
                      }

                      let createManyOp = await bulkUsersAsync(payload)

                      if (createManyOp.isError) {
                        toast({
                          title: 'Error',
                          description: ` ${createManyOp.message}`,
                          position: 'bottom-right',
                          status: 'error',
                          duration: 3000,
                        })
                      } else {
                        toast({
                          title: 'Succeed',
                          description: `Added ${createManyOp.count} users`,
                          position: 'bottom-right',
                          status: 'success',
                          duration: 3000,
                        })
                      }
                      setInputFile(null)
                      usersArraySet([])
                    }}
                  >
                    Bulk Add
                  </Button>
                  <Button
                    flex="1"
                    variant="outline-blue"
                    onClick={async () => {
                      setInputFile(null)
                      usersArraySet([])
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </AdminCard>
            )}
          </HalfPageWrapper>
        </Form>
      )}
    </Formik>
  )
}

export default AdminBulkUsersAdd

const getTemplate = () => {
  const csvString = [
    ['wallet'],
    ['0xe90344F1526B04a59294d578e85a8a08D4fD6e0b'],
    ['0xe90344F1526B04a59294d578e85a8a08D4fD6e0c'],
  ]
    .map((e) => e.join(','))
    .join('\n')

  return csvString
}
