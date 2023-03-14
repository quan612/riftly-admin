import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'

import Enums from 'enums'
import axios from 'axios'

import {
  Heading,
  Box,
  Flex,
  Button,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Switch,
  GridItem,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { RiftlyTooltip } from '@components/shared/Icons'
import { useAdminRequiredSMSMutation, useAdminRequiredSMSQuery } from '@hooks/admin/settings'
import Loading from '@components/shared/LoadingContainer/Loading'
import { useDebounce } from 'react-use'

const EnvironmentConfig = () => {
  const shadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'none')
  const [configs, setConfigs] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const getQueryConfig = async () => {
    setLoading(true)
    let queryConfig = await axios
      .get(`${Enums.BASEPATH}/api/admin/settings/variables/`)
      .then((r) => r.data)
    setLoading(false)
    setConfigs(queryConfig)
  }

  useEffect(() => {
    getQueryConfig()
  }, [])

  const initialValues = {
    id: configs?.id || null,
    discordId: configs?.discordId || '',
    discordBotToken: configs?.discordBotToken || '',
    discordSecret: configs?.discordSecret || '',
    discordBackend: configs?.discordBackend || '',
    discordBackendSecret: configs?.discordBackendSecret || '',
    twitterId: configs?.twitterId || '',
    twitterSecret: configs?.twitterSecret || '',
    pendingRewardImageUrl: configs?.pendingRewardImageUrl || '',
    cloudinaryName: configs?.cloudinaryName || '',
    cloudinaryKey: configs?.cloudinaryKey || '',
    cloudinarySecret: configs?.cloudinarySecret || '',
    hostUrl: configs?.hostUrl || '',
    twitterBearerToken: configs?.twitterBearerToken || '',
    googleClientEmail: configs?.googleClientEmail || '',
    googleClientId: configs?.googleClientId || '',
    googleProjectId: configs?.googleProjectId || '',
    googlePropertyId: configs?.googlePropertyId || '',

    smsSid: configs?.smsSid || '',
    smsAuthToken: configs?.smsAuthToken || '',
    smsServiceId: configs?.smsServiceId || '',
  }

  const toast = useToast()

  const [requiredSMS, isQueryingSmsVerify] = useAdminRequiredSMSQuery()
  const [requiredSMSData, isMutatingSmsVerify, mutateRequiredSMSAsync] =
    useAdminRequiredSMSMutation()

  const [temp, setTemp] = useState(requiredSMS)

  const [, cancel] = useDebounce(
    () => {
      if (temp !== requiredSMS && temp !== undefined) {
        handleOnRequiredSMSChange(temp)
      }
    },
    1500,
    [temp],
  )

  const handleOnRequiredSMSChange = async (val) => {
    try {
      const payload = { isEnabled: val, id: initialValues.id }
      let res = await mutateRequiredSMSAsync(payload)
      if (res) {
        toast({
          title: 'Success',
          description: 'Update required SMS successful',
          position: 'bottom-right',
          status: 'success',
          duration: 2000,
        })
      }
    } catch (err) {
      toast({
        title: 'Exception',
        description: `Catch error at: ${err.message}. Please contact admin.`,
        position: 'bottom-right',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <div className="col-6 mb-3">
        <label className="form-label">Environment Type: {configs?.env || 'Development'}</label>
      </div>
      {isLoading && <Loading />}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={async (fields, { setErrors, resetForm }) => {
          const payload = { ...fields }
          setLoading(true)

          try {
            const res = await axios
              .post(`${Enums.BASEPATH}/api/admin/settings/variables/upsert`, payload)
              .then((r) => r.data)

            if (res.isError) {
              setErrors(res.message)
            } else {
              toast({
                title: 'Succeed',
                description: 'Update config successful',
                position: 'bottom-right',
                status: 'success',
                duration: 2000,
              })
            }
          } catch (error) {
            console.log(error.message)
            setErrors(error.message)
          }

          setLoading(false)
        }}
      >
        {({ errors, status, touched }) => (
          <Box w="100%">
            <Form>
              <Flex
                flexDirection={{
                  base: 'row',
                }}
                w="100%"
                h="100%"
                justifyContent="center"
                mb="60px"
                mt={{ base: '20px', md: '20px' }}
                gap="20px"
              >
                <Box w={{ base: '100%' }} minW="100%">
                  <AdminCard boxShadow={shadow} py="8">
                    <SimpleGrid columns={{ base: 1, '2xl': 3 }} columnGap={10} rowGap={4} w="full">
                      <GridItem colSpan={3}>
                        <Heading size="lg" text="white">
                          Discord
                        </Heading>
                      </GridItem>
                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Bot token
                            <RiftlyTooltip label="Bot needs at least SEND_MESSAGE permission on the server" />
                          </FormLabel>

                          <Field
                            as={Input}
                            id="discordBotToken"
                            size="lg"
                            name="discordBotToken"
                            type="password"
                            variant="auth"
                            placeholder="Token for Bot"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Client Id
                          </FormLabel>

                          <Field
                            as={Input}
                            id="discordId"
                            size="lg"
                            name="discordId"
                            type="text"
                            variant="auth"
                            placeholder="Discord Client Id"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={3}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Client Secret
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            id="discordSecret"
                            name="discordSecret"
                            type="password"
                            variant="auth"
                            placeholder="Discord Client Secret"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={3}>
                        <Divider />
                      </GridItem>

                      <GridItem colSpan={3}>
                        <Heading size="lg" text="white">
                          Twitter
                        </Heading>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Bearer token
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="twitterBearerToken"
                            id="twitterBearerToken"
                            type="password"
                            variant="auth"
                            placeholder="Twitter bearer token"
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Client Id
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="twitterId"
                            id="twitterId"
                            type="text"
                            variant="auth"
                            placeholder="Twitter Client Id"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 2 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Client Secret
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="twitterSecret"
                            id="twitterSecret"
                            type="password"
                            variant="auth"
                            placeholder="Twitter Client Secret"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={3}>
                        <Divider />
                      </GridItem>

                      <GridItem colSpan={3}>
                        <Heading size="lg" text="white">
                          Misc
                        </Heading>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 2 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Pending Reward Image Url
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="pendingRewardImageUrl"
                            id="pendingRewardImageUrl"
                            type="text"
                            variant="auth"
                            placeholder="A Http url link to pending reward image"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel fontSize="md" fontWeight="bold" position={'relative'}>
                            Host Url
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="hostUrl"
                            id="hostUrl"
                            type="text"
                            variant="auth"
                            placeholder="Vercel host that referred on multiple places"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Cloudinary name
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="cloudinaryName"
                            id="cloudinaryName"
                            type="text"
                            variant="auth"
                            placeholder="Name of cloudinary instance"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Cloudinary Key
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="cloudinaryKey"
                            id="cloudinaryKey"
                            type="text"
                            variant="auth"
                            placeholder="Cloudinary key"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 2 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Cloudinary Secret
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="cloudinarySecret"
                            id="cloudinarySecret"
                            type="password"
                            variant="auth"
                            placeholder="Cloudinary Secret"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={3}>
                        <Divider />
                      </GridItem>
                      {/* <GridItem colSpan={{ base: 3 }}>
                        <Heading size="lg" text="white">
                          Google Analytics
                          <RiftlyTooltip label="Still need a process env of private key as it cannot be stored here" />
                        </Heading>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Client Email
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="googleClientEmail"
                            id="googleClientEmail"
                            type="text"
                            variant="auth"
                            placeholder="Client Email"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Client Id
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="googleClientId"
                            id="googleClientId"
                            type="text"
                            variant="auth"
                            placeholder="Client Id"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Project Id
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="googleProjectId"
                            id="googleProjectId"
                            type="text"
                            variant="auth"
                            placeholder="Project Id"
                          />
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={{ base: 3, '2xl': 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Property Id
                          </FormLabel>

                          <Field
                            as={Input}
                            size="lg"
                            name="googlePropertyId"
                            id="googlePropertyId"
                            type="text"
                            variant="auth"
                            placeholder="Property Id"
                          />
                        </FormControl>
                      </GridItem> */}
                    </SimpleGrid>

                    <GridItem colSpan={3}>
                      <Divider />
                    </GridItem>
                    <GridItem colSpan={{ base: 3 }}>
                      <Heading size="lg" text="white">
                        SMS
                      </Heading>
                    </GridItem>

                    <GridItem colSpan={{ base: 3, xl: 1 }}>
                      <FormControl mb="24px">
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                          Sms Sid (Currently on process env)
                        </FormLabel>

                        <Field
                          as={Input}
                          size="lg"
                          name="smsSid"
                          id="smsSid"
                          type="text"
                          variant="auth"
                          placeholder="Sms Sid"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={{ base: 3, xl: 1 }}>
                      <FormControl mb="24px">
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                          Sms Auth token
                        </FormLabel>

                        <Field
                          as={Input}
                          size="lg"
                          name="smsAuthToken"
                          id="smsAuthToken"
                          type="password"
                          variant="auth"
                          placeholder="Sms Auht Token"
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={{ base: 3, xl: 1 }}>
                      <FormControl mb="24px">
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                          Sms Service Id
                        </FormLabel>

                        <Field
                          as={Input}
                          size="lg"
                          name="smsServiceId"
                          id="smsServiceId"
                          type="text"
                          variant="auth"
                          placeholder="Sms Service Id"
                        />
                      </FormControl>
                    </GridItem>

                    {requiredSMS !== undefined && (
                      <GridItem colSpan={{ base: 3, xl: 1 }}>
                        <FormControl mb="24px">
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold" position={'relative'}>
                            Required SMS
                          </FormLabel>
                          <Switch
                            // isChecked={requiredSMS}
                            defaultChecked={requiredSMS}
                            id="toogle-sms-verification"
                            onChange={(e) => {
                              console.log('on change is called')
                              setTemp(e.target.checked)
                            }}
                          />
                        </FormControl>
                      </GridItem>
                    )}

                    <Button
                      w={{ base: '200px' }}
                      my="16px"
                      type="submit"
                      colorScheme="teal"
                      size="lg"
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      Submit
                    </Button>
                  </AdminCard>
                </Box>
              </Flex>
            </Form>
          </Box>
        )}
      </Formik>
    </>
  )
}

export default EnvironmentConfig
