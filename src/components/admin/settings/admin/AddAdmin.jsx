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

import { useAdminMutation } from '@hooks/admin/admin'

const AddAdminSchema = object().shape({
  wallet: string().required('Wallet is required.'),
})

export default function AddAdmin({ createData, createDataSet }) {
  const toast = useToast()
  const [data, isUpserting, upsertAsync] = useAdminMutation()

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={createData}
        validationSchema={AddAdminSchema}
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
              description: `Mutate admin ${fields.username || fields.wallet} successful`,
              position: 'bottom-right',
              status: 'success',
              duration: 2000,
            })
            createDataSet({
              id: -1,
              username: '',
              wallet: '',
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
                          Add New Admin
                        </Heading>
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Username'}
                          fieldName="username"
                          error={errors?.username}
                          touched={touched?.username}
                        />
                      </GridItem>

                      <GridItem colSpan={2}>
                        <RequiredInput
                          label={'Wallet ID'}
                          fieldName="wallet"
                          error={errors?.wallet}
                          touched={touched?.wallet}
                        />
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
                          {createData.isUpdating ? 'Update Admin' : 'Add Admin'}
                        </Button>

                        <Button
                          w={{ base: '200px' }}
                          variant="signIn"
                          onClick={() => {
                            createDataSet({
                              id: -1,
                              username: '',
                              wallet: '',
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
