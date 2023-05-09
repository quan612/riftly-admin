import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import Enums from 'enums'
import axios from 'axios'

import { Heading, Box, Flex, Button, SimpleGrid, GridItem, useToast } from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { RiftlyTooltip } from '@components/shared/Icons'
import Loading from '@components/shared/LoadingContainer/Loading'
import { RequiredInput } from '@components/shared/Formik'

const AnalyticsConfigure = () => {
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
              <Flex w="100%" h="100%" justifyContent="center" gap="20px">
                <Box w={{ base: '100%' }} minW="100%">
                  <AdminCard py="8">
                    <SimpleGrid columns={{ base: 2 }} columnGap={10} rowGap={6} w="full">
                      <GridItem colSpan={2}>
                        <Heading size="md" text="white">
                          Analytics
                          <RiftlyTooltip label="Still need a process env of private key as it cannot be stored here" />
                        </Heading>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Client Email'}
                          fieldName="googleClientEmail"
                          error={errors?.googleClientEmail}
                          touched={touched?.googleClientEmail}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Client Id'}
                          fieldName="googleClientId"
                          error={errors?.googleClientId}
                          touched={touched?.googleClientId}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Project Id'}
                          fieldName="googleProjectId"
                          error={errors?.googleProjectId}
                          touched={touched?.googleProjectId}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={' Property Id'}
                          fieldName="googlePropertyId"
                          error={errors?.googlePropertyId}
                          touched={touched?.googlePropertyId}
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

export default AnalyticsConfigure
