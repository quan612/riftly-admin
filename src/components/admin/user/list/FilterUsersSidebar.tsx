import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react'
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from 'formik'
import { Select as ReactSelect } from 'chakra-react-select'
import {
  Heading,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  GridItem,
  ButtonGroup,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'

import Enums from '@enums/index'
import { UsersContext } from '@context/UsersContext'
import { useEnabledRewardTypesQuery } from '@hooks/admin/reward-types'
import { RewardFilterType } from 'types/common'
import { useNftContractsQuery } from '@hooks/admin/nft-contracts'

const FilterUsersSidebar = () => {
  const { filterObj, filterObjSet, resetFilter } = useContext(UsersContext)
  const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery()
  const [nftContracts, isLoadingnftContracts] = useNftContractsQuery()

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={filterObj}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(fields, { setStatus, resetForm }) => {
          // doing custom filter as not able cast type on RewardType
          setStatus('')
          const { rewards } = fields
          if (rewards.length > 0) {
            rewards.forEach((r) => {
              if (r.minQty < 0) {
                setStatus('Min less than 0')
                return
              }
              if (r.minQty > r.maxQty) {
                setStatus('Min > Max')
                return
              }
            })
          }
          filterObjSet(fields)
        }}
      >
        {({ errors, status, touched, setFieldValue, values, resetForm }) => {
          return (
            <Form>
              <GridItem colSpan={{ base: 1, xl: 1 }}>
                <FormControl mb="16px">
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    User Type
                  </FormLabel>
                  <Field name="type" as={Select} fontSize="md" ms="4px" size="lg">
                    <option value={Enums.WALLET}>{Enums.WALLET}</option>
                    <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                    <option value={Enums.TWITTER}>{Enums.TWITTER}</option>
                    <option value={Enums.EMAIL}>{Enums.EMAIL}</option>
                  </Field>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 1, xl: 2 }}>
                <FormControl mb="16px">
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    User
                  </FormLabel>

                  <Field as={Input} name="user" type="text" variant="auth" fontSize="sm" />
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl mb="16px">
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    NFT Contract
                  </FormLabel>
                  <Field name="nftData" as={Select} fontSize="md" ms="4px" size="lg">
                    <option value={[]}>Select</option>
                    {nftContracts &&
                      nftContracts.map((contract) => {
                        return (
                          <option key={contract.id} value={contract.data}>
                            {contract.name}
                          </option>
                        )
                      })}
                  </Field>
                </FormControl>
              </GridItem>

              <Box h="auto" zIndex={10} mb="12px">
                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                  Rewards
                </FormLabel>
                {rewardTypes && (
                  <ReactSelect
                    isMulti
                    options={rewardTypes.map((r) => {
                      return {
                        id: r.id,
                        label: r.reward,
                        value: r.reward,
                      }
                    })}
                    onChange={(item: any) => {
                      item = item.map((i) => {
                        i.minQty = 1
                        i.maxQty = 10

                        return i
                      })
                      setFieldValue('rewards', item)
                    }}
                    value={values.rewards}
                    closeMenuOnSelect={true}
                    chakraStyles={{
                      control: (provided, state) => ({
                        ...provided,
                        height: 'auto!important',
                        h: 'auto!important',
                      }),
                  
                    }}
                  />
                )}
              </Box>
              <Box display="block">
                <SimpleGrid columns={{ base: 2 }} columnGap={4} rowGap={2} w="full">
                  {values.rewards &&
                    values.rewards.map((item, index) => {
                      const fieldName = `rewards.[${index}]`

                      return (
                        <React.Fragment key={index}>
                          <GridItem colSpan={{ base: 2 }}>
                            <FormLabel ms="2px" fontSize="md" fontWeight="bold">
                              {item.label}
                            </FormLabel>
                          </GridItem>
                          <GridItem colSpan={{ base: 1, xl: 1 }}>
                            <FormControl mb="8px" isRequired>
                              <Field
                                as={Input}
                                size="lg"
                                name={`${fieldName}.minQty`}
                                type="text"
                                variant="auth"
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={{ base: 1, xl: 1 }}>
                            <FormControl mb="8px" isRequired>
                              <Field
                                as={Input}
                                size="lg"
                                name={`${fieldName}.maxQty`}
                                type="text"
                                variant="auth"
                              />
                            </FormControl>
                          </GridItem>
                        </React.Fragment>
                      )
                    })}
                </SimpleGrid>
              </Box>

              {status && <Text color={'red.400'}>Filter error: {status}</Text>}
              <ButtonGroup display={'flex'} justifyContent={'space-around'}>
                <Button
                  w={{ base: '100px' }}
                  my="16px"
                  type="submit"
                  colorScheme="blue"
                  fontSize="16px"
                >
                  Apply
                </Button>
                <Button
                  w={{ base: '100px' }}
                  my="16px"
                  colorScheme="blue"
                  variant="outline"
                  fontSize="16px"
                  onClick={() => {
                    resetForm()
                    resetFilter()
                  }}
                >
                  Clear All
                </Button>
              </ButtonGroup>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}

export default FilterUsersSidebar
