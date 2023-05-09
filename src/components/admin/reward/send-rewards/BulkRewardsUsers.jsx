import React, { useState, useCallback, useRef } from 'react'
import { Field, Form, Formik } from 'formik'

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
} from '@chakra-ui/react'

import {
  Heading,
  Box,
  Flex,
  Link,
  Select,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'

import axios from 'axios'
import { CheckSvg, CrossSvg } from '@components/shared/Icons'
import Loading from '@components/shared/LoadingContainer/Loading'
import { useEnabledRewardTypesQuery } from '@hooks/admin/reward-types'
import { useAdminBulkRewardsMutation } from '@hooks/admin/reward'
import HalfPageWrapper from '../../layout/HalfPageWrapper'
import { HeadingLg, TextMd } from '@components/shared/Typography'
import Enums from '@enums/index'
import { sortByFalseFirst } from '@util/sort'

const BulkRewardsUsers = () => {
  const toast = useToast()
  const [rewardsData, isAddingRewards, bulkRewardsAsync] = useAdminBulkRewardsMutation()
  const [usersArray, usersArraySet] = useState([])
  const [originData, originDataSet] = useState([])
  const hiddenFileInput = useRef(null)

  const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery()

  const [inputFile, setInputFile] = useState(null)
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const [initialValues] = useState({
    rewardTypeId: -1,
    quantity: 1,
  })

  const handleOnLoadFile = useCallback((e) => {
    if (!e.target.files[0]) {
      return
    }
    const reader = new FileReader()

    reader.readAsBinaryString(e.target.files[0])
    reader.onload = async function (onLoadEvent) {
      let data = onLoadEvent.target.result

      let workbook = read(data, { type: 'string', raw: true })

      let currentWorkBook = workbook.Sheets[workbook.SheetNames[0]]

      let arrayData = excelUtils.sheet_to_json(currentWorkBook).map((r) => {
        let value = Object.values(r)[0]
        return { wallet: value, isValid: utils.isAddress(value) }
      })
      originDataSet(arrayData)

      let walletArray = arrayData.map((r) => r.wallet)

      let payload = {
        walletArray,
      }
      let usersSearch = await axios.post(`/api/admin/search/users`, payload).then((r) => r.data)

      usersArraySet(usersSearch)
    }
    setInputFile(e.target.files[0])
    e.target.value = ''
  }, [])

  const onSubmitForm = async (fields, { setStatus, resetForm, setFieldValue }) => {
    try {
      const { quantity, rewardTypeId } = fields

      setInputFile(null)

      let chunkSplit = []
      const chunkSize = 100
      for (let i = 0; i < usersArray.length; i += chunkSize) {
        chunkSplit = [...chunkSplit, usersArray.slice(i, i + chunkSize)]
      }

      const op = await Promise.allSettled(
        chunkSplit.map(async (chunk) => {
          const payload = {
            chunk,
            rewardTypeId: parseInt(rewardTypeId),
            quantity,
          }

          let res = await bulkRewardsAsync(payload)
          res.start = chunk[0].wallet
          res.end = chunk[chunk.length - 1].wallet
          console.log(res)
          return res
        }),
      )

      let error = 0
      for (let i = 0; i < op.length; i++) {
        if (op[i]?.value?.isError) {
          console.log(op[i]?.value?.message)
          error++
        }
      }
      if (error > 0)
        toast({
          title: 'Exception',
          description: `There were some errors. Log has been tracked. Please contact admin.`,
          position: 'bottom-right',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      else {
        toast({
          title: 'Success',
          description: `Bulk Reward successful.`,
          position: 'top-right',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      }
      setInputFile(null)
      usersArraySet([])
      originDataSet([])
      resetForm()
    } catch (error) {
      toast({
        title: 'Exception',
        description: `There were some errors. Log has been tracked. Please contact admin.`,
        position: 'bottom-right',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }
  return (
    <>
      {isAddingRewards && <Loading />}
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={initialValues}
        onSubmit={onSubmitForm}
      >
        {({ errors, status, touched, values, setFieldValue, handleChange, resetForm, dirty }) => (
          <Box w="100%">
            <Form>
              <HalfPageWrapper>
                <AdminCard>
                  <Flex direction="column" gap="20px">
                    <HeadingLg>Reward Users</HeadingLg>
                    <TextMd color="brand.neutral2">
                      Reward users in bulk by downloading our template in .csv format and uploading
                      the completed file.
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
                          download={`Rewards Wallet Bulk.csv`}
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
                      style={{ opacity: 0, width: '0px', height: '0px' }}
                      ref={hiddenFileInput}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleOnLoadFile(e)
                      }}
                    />
                  </Flex>

                  {originData && originData.length > 0 && (
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
                            {originData.sort(sortByFalseFirst).map((row, index) => {
                              return (
                                <Tr key={index}>
                                  <Td
                                    pl="0"
                                    color={`${originData[index].isValid ? 'white' : 'red.300'}`}
                                  >
                                    {originData[index].wallet}
                                  </Td>
                                  <Td pe="0">
                                    {originData[index].isValid && <CheckSvg />}
                                    {!originData[index].isValid && <CrossSvg />}
                                  </Td>
                                </Tr>
                              )
                            })}
                          </Tbody>
                        </Table>
                      </Box>
                    </Flex>
                  )}
                  {inputFile && (
                    <Text color="brand.neutral2" align={'center'}>
                      {inputFile.name}
                    </Text>
                  )}
                </AdminCard>

                {/* Reward */}
                <AdminCard py="8">
                  <SimpleGrid minChildWidth={'300px'} columns={{ base: 2 }} rowGap={4}>
                    <GridItem colSpan={2}>
                      <Flex direction="column" gap="20px">
                        <HeadingLg>Reward</HeadingLg>
                        <TextMd color="brand.neutral2">
                          {`Choose the type of reward and the quantity. Reward types can be edited and added in Settings > Rewards`}
                        </TextMd>
                      </Flex>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl
                        isRequired
                        isInvalid={errors.rewardTypeId && touched.rewardTypeId}
                      >
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                          Reward Type
                        </FormLabel>
                        <Field
                          name="rewardTypeId"
                          as={Select}
                          fontSize="md"
                          ms="4px"
                          size="lg"
                          validate={(value) => {
                            let error
                            if (value < 0) {
                              error = 'Please select a reward.'
                            }
                            return error
                          }}
                        >
                          <option key={-1} value={-1}>
                            Select reward type
                          </option>
                          {rewardTypes &&
                            rewardTypes.map((type, index) => {
                              return (
                                <option key={index} value={type.id}>
                                  {type.reward}
                                </option>
                              )
                            })}
                        </Field>
                        <FormErrorMessage fontSize="md">{errors.rewardTypeId}</FormErrorMessage>
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl isInvalid={errors.quantity} isRequired>
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                          Quantity
                        </FormLabel>

                        <Field
                          as={Input}
                          size="lg"
                          name="quantity"
                          type="number"
                          variant="auth"
                          validate={(value) => {
                            let error
                            if (value.length < 1) {
                              error = 'Quantity cannot be blank.'
                            } else if (value < 1) {
                              error = 'Quantity must be at least 1.'
                            }
                            return error
                          }}
                        />

                        <FormErrorMessage fontSize="md">{errors.quantity}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </SimpleGrid>
                  {status && <Text colorScheme={'red'}>API error: {status} </Text>}

                  <ButtonGroup mt="16px" w="100%">
                    <Button
                      variant="blue"
                      flex="1"
                      type="submit"
                      disabled={usersArray.length === 0 || !dirty}
                    >
                      Bulk Rewards
                    </Button>
                    <Button
                      flex="1"
                      variant="outline-blue"
                      onClick={async () => {
                        resetForm()
                        setInputFile(null)
                        usersArraySet([])
                        originDataSet([])
                      }}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </AdminCard>
              </HalfPageWrapper>
              {process.env.NODE_ENV !== 'production' && (
                <>
                  <p>Values:</p>
                  <pre>
                    <code>{JSON.stringify(values, null, 2)}</code>
                  </pre>
                  <p>Errors:</p>
                  <pre>
                    <code>{JSON.stringify(errors, null, 2)}</code>
                  </pre>
                </>
              )}
            </Form>
          </Box>
        )}
      </Formik>
    </>
  )
}

export default BulkRewardsUsers

const getTemplate = () => {
  const csvString = [
    ['wallet'],
    ['0xe90344F1526B04a59294d578e85a8a08D4fD6e0b'],
    ['0x7ad5B0328F69356E7DED82d238e67714630D559F'],
  ]
    .map((e) => e.join(','))
    .join('\n')

  return csvString
}
