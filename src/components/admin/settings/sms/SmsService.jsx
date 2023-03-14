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
  GridItem,
  useToast,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import Loading from '@components/shared/LoadingContainer/Loading'
import { useDebounce } from 'react-use'
import { RequiredInput, RequiredPasswordInput } from '@components/shared/Formik'
import { useAdminRequiredSMSMutation, useAdminRequiredSMSQuery } from '@hooks/admin/settings'

const SmsService = () => {
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
        console.log(temp)
        console.log(requiredSMS)
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
      {isLoading && <Loading />}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={async (fields, { setErrors, resetForm, setStatus }) => {
          const payload = { ...fields }
          setLoading(true)

          try {
            const res = await axios
              .post(`${Enums.BASEPATH}/api/admin/settings/variables/upsert`, payload)
              .then((r) => r.data)

            if (res.isError) {
              setStatus(res.message)
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
            setStatus(error.message)
          }

          setLoading(false)
        }}
      >
        {({ values, errors, status, touched, handleChange, setFieldValue, dirty }) => (
          <Box w="100%">
            <Form>
              <Flex
                w="100%"
                h="100%"
                justifyContent="center"
                mb="60px"
                mt={{ base: '20px', md: '20px' }}
                gap="20px"
              >
                <Box w={{ base: '100%' }} minW="100%">
                  <AdminCard boxShadow={shadow} py="8">
                    <SimpleGrid columns={{ base: 2, xl: 1 }} columnGap={10} rowGap={6} w="full">
                      <GridItem colSpan={2}>
                        <RequiredPasswordInput
                          label={'Sms Sid'}
                          fieldName="smsSid"
                          error={errors?.smsSid}
                          touched={touched?.smsSid}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredPasswordInput
                          label={'Sms Auth Token'}
                          fieldName="smsAuthToken"
                          error={errors?.smsAuthToken}
                          touched={touched?.smsAuthToken}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredPasswordInput
                          label={' Sms Service Id'}
                          fieldName="smsServiceId"
                          error={errors?.smsServiceId}
                          touched={touched?.smsServiceId}
                        />
                      </GridItem>

                      {requiredSMS !== undefined && (
                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel
                              ms="4px"
                              fontSize="md"
                              fontWeight="bold"
                              position={'relative'}
                            >
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

                      <GridItem colSpan={2}>
                        <Button
                          w={{ base: '150px' }}
                          type="submit"
                          variant="blue"
                          isLoading={isLoading}
                          disabled={isLoading || !dirty}
                        >
                          Submit
                        </Button>
                      </GridItem>
                    </SimpleGrid>
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

export default SmsService
