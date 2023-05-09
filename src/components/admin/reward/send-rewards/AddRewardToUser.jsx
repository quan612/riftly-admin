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
  RadioGroup,
  Image,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { useAdminRewardSingleUser } from '@hooks/admin/reward'
import HalfPageWrapper from '../../layout/HalfPageWrapper'
import { HeadingLg, TextMd } from '@components/shared/Typography'
import RiftlyRadio from '@components/shared/Radio'

const AddRewardToUser = () => {
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
    method: Enums.AUTOMATIC,
  })

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
      <Flex justify={'center'}>
        <Image src={srcImage} alt="reward-preview" w={'70%'} />
      </Flex>
    )
  })

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
                <AdminCard>
                  <Flex direction="column" gap="20px">
                    <HeadingLg>User</HeadingLg>
                    <TextMd color="brand.neutral2">
                      Fill in the information of the receiver of the reward. This can be wallet
                      address, Discord handle (user#1234), or Twitter handle.
                    </TextMd>

                    <FormControl>
                      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Account Type
                      </FormLabel>
                      <Field name="type" as={Select} fontSize="md" ms="4px" size="lg">
                        <option value={Enums.WALLET}>{Enums.WALLET}</option>
                        <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                        <option value={Enums.TWITTER}>{Enums.TWITTER}</option>
                      </Field>
                    </FormControl>

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
                  </Flex>
                </AdminCard>

                <AdminCard py="8">
                  <SimpleGrid columns={2} rowGap={4} w="full">
                    <GridItem colSpan={2}>
                      <Flex direction="column" gap="20px">
                        <HeadingLg>User</HeadingLg>
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
                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                          Claiming Method
                        </FormLabel>

                        <RadioGroup
                          onChange={(val) => setFieldValue('method', val)}
                          value={values.method}
                        >
                          <Flex
                            gap="1rem"
                            direction={{ base: 'column', md: 'row' }}
                            // justifyContent={'space-between'}
                          >
                            <RiftlyRadio value={Enums.MANUAL} isDisabled={true}>
                              User claims manually from notification
                            </RiftlyRadio>
                            <RiftlyRadio value={Enums.AUTOMATIC}>
                              Reward automatically deposit to user
                            </RiftlyRadio>
                          </Flex>
                        </RadioGroup>
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                      {discordChannels && discordChannels.length > 0 && (
                        <>
                          <Text ms="4px" fontSize="md" fontWeight="bold" mb="4px">
                            Post To Discord Channels
                          </Text>
                          <TextMd color="brand.neutral2" mb="10px">
                            {`Multiple channels may be selected for posting reward message. Message will not be posted if there are no channels added. Channels can be added in Settings > Discord.`}
                          </TextMd>

                          <Box display={'flex'} gap="16px" flexWrap={'wrap'}>
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
                                <GridItem colSpan={2} key={index}>
                                  <FormControl display="flex" alignItems="center">
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
                                        tmp = [...tmp, postToThisChannel]

                                        setFieldValue('postInDiscordChannels', tmp)
                                      }}
                                    />

                                    <FormLabel mb="0" fontWeight="normal">
                                      {d.channel}
                                    </FormLabel>
                                  </FormControl>
                                </GridItem>
                              )
                            })}
                          </Box>
                        </>
                      )}
                    </GridItem>
                  </SimpleGrid>
                </AdminCard>

                <AdminCard bg="transparent" border="1px solid" borderColor="brand.neutral3">
                  <Flex direction="column" gap="20px">
                    <HeadingLg>Reward Preview</HeadingLg>
                    <TextMd color="brand.neutral2">
                      {`Reward image can be adjusted in Settings > Rewards.`}
                    </TextMd>

                    {getPreviewImage(values.rewardTypeId, rewardTypes)}

                    {status && (
                      <Text color="red.300" w="100%">
                        {status}
                      </Text>
                    )}
                  </Flex>

                  <Flex justifyContent="center" mt="32px">
                    <Button
                      w="50%"
                      variant="blue"
                      type="submit"
                      disabled={!dirty}
                      isLoading={isSubmitting}
                    >
                      Send Reward
                    </Button>
                  </Flex>
                </AdminCard>
              </HalfPageWrapper>
              {/* Debug */}
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
        )
      }}
    </Formik>
  )
}

export default AddRewardToUser
