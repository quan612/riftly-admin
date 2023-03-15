import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import Enums from 'enums'
import axios from 'axios'
import { Heading, Box, Flex, Button, SimpleGrid, GridItem, useToast } from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import Loading from '@components/shared/LoadingContainer/Loading'
import { RequiredInput, RequiredPasswordInput } from '@components/shared/Formik'

const TwitterBotInfo = () => {
  const [configs, setConfigs] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const toast = useToast()

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
              <Flex w="100%" h="100%" justifyContent="center">
                <Box w={{ base: '100%' }} minW="100%">
                  <AdminCard py="8">
                    <SimpleGrid columns={{ base: 2 }} rowGap={6} w="full">
                      <GridItem colSpan={2}>
                        <Heading size="md" text="white">
                          Twitter
                        </Heading>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <RequiredPasswordInput
                          label={'Twitter Bearer Token'}
                          fieldName="twitterBearerToken"
                          error={errors?.twitterBearerToken}
                          touched={touched?.twitterBearerToken}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Client Id'}
                          fieldName="twitterId"
                          error={errors?.twitterId}
                          touched={touched?.twitterId}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredPasswordInput
                          label={'Client Secret'}
                          fieldName="twitterSecret"
                          error={errors?.twitterSecret}
                          touched={touched?.twitterSecret}
                        />
                      </GridItem>

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

export default TwitterBotInfo
