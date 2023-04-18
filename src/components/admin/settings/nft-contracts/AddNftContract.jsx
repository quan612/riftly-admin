import React, { useState, useRef } from 'react'
import { Field, Form, Formik } from 'formik'
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
  Select,
} from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { RiftlyTooltip } from '@components/shared/Icons'
import { RequiredInput } from '@components/shared/Formik'

import { useNftContractsMutation } from '@hooks/admin/nft-contracts'

const AddNftContractSchema = object().shape({
  address: string().required('Address is required.'),
  name: string().required('Name is required.'),
})

export default function AddNftContract({ createData, createDataSet }) {
  const toast = useToast()
  const [data, isUpserting, upsertAsync] = useNftContractsMutation()

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={createData}
        validationSchema={AddNftContractSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (fields, { setStatus, resetForm }) => {
          setStatus(null)

          let op = await upsertAsync({
            ...fields,
          })

          if (op.isError) {
            setStatus(op.message)
          } else {
            resetForm()
            toast({
              title: 'Succeed',
              description: `Mutate nft contract ${fields.name} successful`,
              position: 'bottom-right',
              status: 'success',
              duration: 2000,
            })
            createDataSet({
              id: -1,
              name: '',
              address: '',
              chain: 'eth',
              isUpdating: false,
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
                        <Heading size="md" text="white">
                          Add New Nft Contract
                        </Heading>
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Contract Name'}
                          fieldName="name"
                          error={errors?.name}
                          touched={touched?.name}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Contract Address'}
                          fieldName="address"
                          error={errors?.address}
                          touched={touched?.address}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <FormControl>
                          <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                            Chain
                          </FormLabel>
                          <Field name="chain" as={Select} fontSize="md" ms="4px" size="lg">
                            <option value="eth">eth</option>
                            <option value="polygon">polygon</option>
                          </Field>
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
                          variant="blue"
                          disabled={!dirty || isUpserting}
                          isLoading={isUpserting}
                        >
                          {createData.isUpdating ? 'Update' : 'Save'}
                        </Button>

                        <Button
                          w={{ base: '200px' }}
                          variant="signIn"
                          onClick={() => {
                            createDataSet({
                              id: -1,
                              name: '',
                              address: '',
                              chain: 'eth',
                              isUpdating: false,
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
