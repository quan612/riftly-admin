import React, { useEffect, useState, useRef } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { object, array, string, number } from 'yup'
import { utils } from 'ethers'
import Enums from 'enums'
import { useCallback } from 'react'

import { useEnabledAdminDiscordChannelsQuery } from '@hooks/admin/settings'
import { useEnabledRewardTypesQuery } from '@hooks/admin/reward-types'

import {
  Box,
  Flex,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Switch,
  Select,
  useToast,
  GridItem,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { useAdminRewardSingleUser } from '@hooks/admin/reward'
import HalfPageWrapper from '../layout/HalfPageWrapper'

const AddRewardToUser = () => {
  const bg = useColorModeValue('white', '#1B254B')
  const shadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'none')
  const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery()
  const [discordChannels, isLoadingDiscordChannels] = useEnabledAdminDiscordChannelsQuery()

  const [data, isSubmitting, rewardAsync] = useAdminRewardSingleUser()

  const [initialValues, initialValuesSet] = useState({
    username: '',
    type: 'Wallet',
    rewardTypeId: -1,
    quantity: 1,
    postInDiscordChannels: [],
    generatedURL: '',
    addRewardDirectly: true,
  })

  const generatedRef = useRef()

  const RewardSchema = object().shape({
    username: string()
      .required()
      .test('valid address', 'Wallet address is not valid.', function () {
        if (this.parent.type === Enums.WALLET && !utils.isAddress(this.parent.username))
          return false
        return true
      }),
  })

  const toast = useToast()

  const onSubmitForm = async (fields, { setStatus, resetForm, setFieldValue }) => {
    try {
      const res = await rewardAsync(fields)

      if (res?.isError) {
        generatedRef.current.value = ''
        setStatus(res?.message)
      } else {
        toast({
          title: 'Success',
          description: `Reward user ${fields.username} successful.`,
          position: 'bottom-right',
          status: 'success',
          duration: 3000,
        })
        resetForm()
        setFieldValue('postInDiscordChannels', [])
        // generatedRef.current.value = `${res.embededLink}`

        if (res.errorArray) {
          let statusArray = ''
          res.errorArray.map((e) => {
            statusArray = statusArray + `${e.error}`
          })
          setStatus(statusArray)
        }
      }
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={RewardSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onSubmitForm}
    >
      {({ errors, status, touched, values, setFieldValue, handleChange, dirty }) => {
        return (
          <Box w="100%">
            <Form>
              <HalfPageWrapper>
                <AdminCard boxShadow={shadow} py="8">
                  <SimpleGrid columns={1} rowGap={4} w="full">
                    <GridItem>
                      <FormControl>
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                          User Type
                        </FormLabel>
                        <Field name="type" as={Select} fontSize="md" ms="4px" size="lg">
                          <option value={Enums.WALLET}>{Enums.WALLET}</option>
                          <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                          <option value={Enums.TWITTER}>{Enums.TWITTER}</option>
                        </Field>
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                      <FormControl isRequired isInvalid={errors.username && touched.username}>
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                          User
                        </FormLabel>

                        <Field
                          as={Input}
                          name="username"
                          type="text"
                          variant="riftly"
                          placeholder="Wallet / Discord User abc#1234 / Twitter User"
                          validate={(value) => {
                            let error

                            if (values.type === Enums.WALLET && !utils.isAddress(value)) {
                              error = 'Invalid address checksum.'
                            }
                            if (
                              (values.type === Enums.DISCORD || values.type === Enums.TWITTER) &&
                              value.length < 1
                            ) {
                              error = 'User cannot be blank.'
                            }
                            return error
                          }}
                        />
                        <FormErrorMessage fontSize="md">{errors.username}</FormErrorMessage>
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
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
                            Select a reward
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

                    <GridItem colSpan={1}>
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

                    <GridItem colSpan={1}>
                      {discordChannels && discordChannels.length > 0 && (
                        <FormControl>
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                            Post To Discord Channels
                          </FormLabel>

                          <Box display={'flex'} gap="16px">
                            {discordChannels.map((d, index) => {
                              let isChecked = false
                              if (values.postInDiscordChannels.length === 0) {
                                isChecked = false
                              } else {
                                let checkIndex = values.postInDiscordChannels.findIndex(
                                  (c) => c.channelId === d.channelId,
                                )

                                if (checkIndex === -1) {
                                  isChecked = false
                                } else {
                                  if (values.postInDiscordChannels[checkIndex].toPost)
                                    isChecked = true
                                }
                              }

                              return (
                                <FormControl display="flex" alignItems="center" key={index}>
                                  <Switch
                                    isChecked={isChecked}
                                    name="postInDiscordChannels"
                                    id="remember-login"
                                    colorScheme="blue"
                                    me="10px"
                                    onChange={(event) => {
                                      let toPost = event.target.checked

                                      let postToThisChannel = {
                                        channel: d.channel,
                                        channelId: d.channelId,
                                        toPost,
                                      }

                                      let tmp = values.postInDiscordChannels.filter(
                                        (r) => r?.channelId !== postToThisChannel.channelId,
                                      )

                                      // if (toPost) {
                                      tmp = [...tmp, postToThisChannel]
                                      // }

                                      setFieldValue('postInDiscordChannels', tmp)
                                    }}
                                  />

                                  <FormLabel mb="0" fontWeight="normal">
                                    {d.channel}
                                  </FormLabel>
                                </FormControl>
                              )
                            })}
                          </Box>
                        </FormControl>
                      )}
                    </GridItem>

                    <GridItem colSpan={1}>
                      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Add Reward Directly
                      </FormLabel>
                      <Switch
                        isDisabled={true}
                        name="addRewardDirectly"
                        isChecked={values.addRewardDirectly ? true : false}
                        onChange={handleChange}
                      />
                    </GridItem>
                    {/* <GridItem colSpan={{ base: 1, lg: 2 }}>
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                          Generated URL
                        </FormLabel>
                        <Input name="generatedURL" type="text" disabled={true} ref={generatedRef} />
                      </GridItem> */}
                    <RewardPreviewCard
                      rewardTypeId={values.rewardTypeId}
                      rewardTypes={rewardTypes}
                    />
                  </SimpleGrid>

                  {status && <Text colorScheme={'red'}>API error: {status} </Text>}
                  <Button
                    w={{ base: '200px' }}
                    my="16px"
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    isLoading={isSubmitting}
                    // disabled={isSubmitButtonDisabled(values)}
                  >
                    Submit
                  </Button>
                </AdminCard>
              </HalfPageWrapper>
            </Form>
          </Box>
        )
      }}
    </Formik>
  )
}

export default AddRewardToUser

const RewardPreviewCard = ({ rewardTypeId, rewardTypes }) => {
  const bg = useColorModeValue('white', '#1B254B')
  const shadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'none')
  const getPreviewImage = useCallback((rewardTypeId, rewardTypes) => {
    if (!rewardTypes) {
      return null
    }
    let selectedReward = rewardTypes.find((r) => parseInt(r.id) === parseInt(rewardTypeId))

    if (
      !selectedReward ||
      !selectedReward?.rewardPreview ||
      selectedReward?.rewardPreview?.trim().length < 1
    ) {
      return null
    }

    let srcImage = selectedReward?.rewardPreview
    return (
      <AdminCard boxShadow={shadow} py="10px">
        <img src={srcImage} alt="reward-preview" />
      </AdminCard>
    )
  })

  return (
    <Box w={{ base: '150px', lg: '200px' }} h={{ base: '150px', lg: 'auto' }}>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
        Preview
      </FormLabel>
      {getPreviewImage(rewardTypeId, rewardTypes)}
    </Box>
  )
}

// checked={
//     values
//         ?.postInDiscordChannels[
//         index
//     ]?.toPost
//         ? values
//               ?.postInDiscordChannels[
//               index
//           ]?.toPost
//         : false
// }
// defaultChecked={false}
// defaultChecked={() => {
//     if (
//         values
//             .postInDiscordChannels
//             .length === 0
//     ) {
//         return false;
//     }
//     let checkIndex =
//         values.postInDiscordChannels.findIndex(
//             (c) =>
//                 c.channelId ===
//                 d.channelId
//         );
//     if (checkIndex !== -1) {
//         return false;
//     }
//     return true;
// }}
