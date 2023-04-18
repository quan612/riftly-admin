import React, { useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { object, string, number } from 'yup'

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
  contract: string().required('Contract address is required.'),
  maxRedeemable: number().required().min(0),
})

export default function AddRedeemableContract({
  upsertRedeemableContractAsync,
  createRedeemableContract,
  createRedeemableContractSet,
}) {
  const initialValues = createRedeemableContract
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

          let upsertOp = await upsertRedeemableContractAsync(payload)

          if (upsertOp.isError) {
            setStatus(upsertOp.message)
          } else {
            resetForm()
            toast({
              title: 'Succeed',
              description: `Mutate contract ${fields.contract} successful`,
              position: 'bottom-right',
              status: 'success',
              duration: 2000,
            })
            createRedeemableContractSet({
              id: -1,
              contract: '',
              maxRedeemable: 0,
              isCreate: true,
            })
          }
        }}
      >
        {({ errors, status, touched, setFieldValue, values, resetForm, handleChange, dirty }) => {
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
                        <RequiredInput
                          label={'Contract Address'}
                          fieldName="contract"
                          error={errors?.contract}
                          touched={touched?.contract}
                          placeholder="Unique address of contract"
                        />
                      </GridItem>

                      <GridItem colSpan={{ base: 2 }}>
                        <RequiredInput
                          label={'Max amount redeemable per account'}
                          fieldName="maxRedeemable"
                          error={errors?.maxRedeemable}
                          touched={touched?.maxRedeemable}
                          placeholder="The amount an user can redeem from this contract"
                        />
                      </GridItem>
                      {/* <GridItem colSpan={{ base: 2 }}>
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
                      </GridItem> */}

                      {status && (
                        <Text fontSize="md" color="red.500" width={'100%'}>
                          {status}
                        </Text>
                      )}

                      <ButtonGroup gap="24px">
                        <Button
                          w={{ base: '200px' }}
                          type="submit"
                          variant="blue"
                          // disabled={!dirty}
                        >
                          Save
                        </Button>

                        <Button
                          w={{ base: '200px' }}
                          variant="signIn"
                          onClick={() => {
                            createRedeemableContractSet({
                              id: -1,
                              contract: '',
                              maxRedeemable: 0,
                              isCreate: false,
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
