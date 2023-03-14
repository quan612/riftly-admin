import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import Enums from 'enums'
import axios from 'axios'

import { Box, Button, useColorModeValue, SimpleGrid, GridItem, useToast } from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'

import Loading from '@components/shared/LoadingContainer/Loading'
import { useDebounce } from 'react-use'
import {
  NonRequiredTextInput,
  RequiredInput,
  RequiredPasswordInput,
} from '@components/shared/Formik'

const ImageHosting = () => {
  const shadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'none')
  const [configs, setConfigs] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const getQueryConfig = async () => {
    setLoading(true)
    let queryConfig = await axios
      .get(`${Enums.BASEPATH}/api/admin/settings/image-hosting/`)
      .then((r) => r.data)
    console.log(queryConfig)
    setLoading(false)
    setConfigs(queryConfig)
  }

  useEffect(() => {
    getQueryConfig()
  }, [])

  const initialValues = {
    id: configs?.id || null,
    cloudinaryName: configs?.cloudinaryName || '',
    cloudinaryKey: configs?.cloudinaryKey || '',
    cloudinarySecret: configs?.cloudinarySecret || '',
    generalPreset: configs?.generalPreset || '',
    avatarPreset: configs?.avatarPreset || '',
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
              .post(`${Enums.BASEPATH}/api/admin/settings/image-hosting/upsert`, payload)
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
        {({ values, errors, status, touched, setFieldValue, dirty }) => (
          <Box w="100%">
            <Form>
              <AdminCard>
                <SimpleGrid columns={{ base: 2 }} rowGap={6} w="full">
                  <GridItem colSpan={2}>
                    <RequiredInput
                      label={'Cloudinary Name'}
                      fieldName="cloudinaryName"
                      error={errors?.cloudinaryName}
                      touched={touched?.cloudinaryName}
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <RequiredInput
                      label={'Cloudinary Key'}
                      fieldName="cloudinaryKey"
                      error={errors?.cloudinaryKey}
                      touched={touched?.cloudinaryKey}
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <RequiredPasswordInput
                      label={'Cloudinary Secret'}
                      fieldName="cloudinarySecret"
                      error={errors?.cloudinarySecret}
                      touched={touched?.cloudinarySecret}
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <NonRequiredTextInput
                      label={'General Preset'}
                      fieldName="generalPreset"
                      error={errors?.generalPreset}
                      touched={touched?.generalPreset}
                      placeholder="Preset for general images"
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <NonRequiredTextInput
                      label={'Avatar Preset'}
                      fieldName="avatarPreset"
                      error={errors?.avatarPreset}
                      touched={touched?.avatarPreset}
                      placeholder="Preset for avatar images"
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
            </Form>
          </Box>
        )}
      </Formik>
    </>
  )
}

export default ImageHosting
