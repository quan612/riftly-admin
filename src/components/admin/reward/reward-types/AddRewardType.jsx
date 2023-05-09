import React, { useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { object, string } from 'yup'

import {
  Heading,
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  Switch,
  GridItem,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { RiftlyTooltip } from '@components/shared/Icons'
import { RequiredInput } from '@components/shared/Formik'
import AdminGeneralImageUpload from '@components/shared/ImageUpload/AdminGeneralImageUpload'

const CreateRewardTypeSchema = object().shape({
  reward: string().required('Reward name is required.'),
  rewardPreview: string().required('Preview Image is required.'),
})

export default function AddRewardType({
  upsertRewardTypeAsync,
  createRewardType,
  createRewardTypeSet,
}) {
  const initialValues = createRewardType

  const getButtonState = (values) => {
    if (createRewardType.isUpdating) {
      if (
        values?.reward === initialValues.reward &&
        values?.rewardPreview === initialValues.rewardPreview &&
        values?.isEnabled === initialValues.isEnabled
      ) {
        return true
      }
    } else {
      if (
        (values?.reward.length === 0 && values?.rewardPreview?.length === 0) ||
        (values?.rewardPreview === initialValues.rewardPreview &&
          values?.isEnabled === initialValues.isEnabled)
      )
        return true
    }
    return false
  }

  const toast = useToast()
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={CreateRewardTypeSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (fields, { setStatus, resetForm }) => {
          setStatus(null)

          const payload = {
            ...fields,
          }

          let upsertOp = await upsertRewardTypeAsync(payload)

          if (upsertOp.isError) {
            setStatus(upsertOp.message)
          } else {
            resetForm()
            toast({
              title: 'Succeed',
              description: `Mutate reward type ${fields.reward} successful`,
              position: 'bottom-right',
              status: 'success',
              duration: 2000,
            })
            createRewardTypeSet({
              id: -1,
              reward: '',
              rewardPreview: '',

              isUpdating: false,
              isEnabled: true,
            })
          }
        }}
      >
        {({ errors, status, touched, setFieldValue, values, resetForm, handleChange }) => {
          return (
            <Box w="100%">
              <Form>
                <Flex
                  flexDirection={{
                    base: 'row',
                  }}
                  w="100%"
                  h="100%"
                  justifyContent="center"
                  gap="16px"
                >
                  <AdminCard py="8">
                    <SimpleGrid columns={2} rowGap={4} w="full">
                      <GridItem colSpan={2}>
                        <Heading size="md" text="white">
                          Add Reward Type
                        </Heading>
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={' Reward Name'}
                          fieldName="reward"
                          error={errors?.reward}
                          touched={touched?.reward}
                        />
                      </GridItem>

                      <GridItem colSpan={{ base: 2 }}>
                        <AdminGeneralImageUpload
                          title={'Embeded Discord Reward Image'}
                          error={errors?.rewardPreview}
                          touched={touched?.rewardPreview}
                          uploaded={values?.rewardPreview}
                          onConfirmUpload={(imageUrl) => {
                            // dont clear the field on cancel, no way to re-upload old file
                            setFieldValue('rewardPreview', imageUrl)
                          }}
                          minH={{ base: 'auto', lg: '420px', '2xl': '365px' }}
                        />
                      </GridItem>
                      <GridItem colSpan={{ base: 2 }}>
                        <FormControl display="flex" flexDirection={'column'} gap="4px">
                          <FormLabel htmlFor="quest-alerts" color="#fff" flex="80%">
                            Enabled
                            <RiftlyTooltip
                              label="Disable Reward Type would hide it from Reward
                                                    User page"
                            />
                          </FormLabel>

                          <Switch
                            name="isEnabled"
                            isChecked={values.isEnabled ? true : false}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </GridItem>

                      {status && (
                        <Text fontSize="md" color="red.500" width={'100%'}>
                          {status}
                        </Text>
                      )}

                      <ButtonGroup gap="24px">
                        <Button
                          w={{ base: '200px' }}
                          type="submit"
                          colorScheme="teal"
                          disabled={getButtonState(values)}
                        >
                          Save
                        </Button>

                        <Button
                          w={{ base: '200px' }}
                          variant="signIn"
                          onClick={() => {
                            createRewardTypeSet({
                              id: -1,
                              reward: '',
                              rewardPreview: '',
                              isUpdating: false,
                              isEnabled: true,
                            })
                            resetForm()
                          }}
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </SimpleGrid>
                    {process.env.NODE_ENV !== 'production' && (
                      <pre>
                        <code>{JSON.stringify(values, null, 2)}</code>
                      </pre>
                    )}
                  </AdminCard>
                </Flex>
              </Form>
            </Box>
          )
        }}
      </Formik>
    </>
  )
}
