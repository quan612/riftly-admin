import React, { useEffect, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { object, array, string, number, ref } from 'yup'
import { utils } from 'ethers'

import Enums from 'enums'

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
  Select,
  GridItem,
  useToast,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { useAdminAddSingleUser } from '@hooks/admin/user'
import HalfPageWrapper from '../layout/HalfPageWrapper'
import { RequiredInput } from '@components/shared/Formik'

const initialValues = {
  type: Enums.WALLET,
  user: '',
}

const UserSchema = object().shape({
  user: string()
    .required()
    .test('valid address', 'Wallet Address is not valid!', function () {
      if (this.parent.type === Enums.DISCORD || this.parent.type === Enums.TWITTER) {
        return true
      }
      if (this.parent.type === Enums.WALLET && utils.isAddress(this.parent.user)) {
        return true
      }
      return false
    }),
})

const AddNewUser = () => {
  const toast = useToast()

  const [newUserData, isAdding, addUserAsync] = useAdminAddSingleUser()

  const onSubmit = async (fields, { setStatus, resetForm, validate }) => {
    try {
      let res = await addUserAsync(fields)
      if (res.isError) {
        setStatus(`Catch error adding new ${fields.type} user: ${res.message}`)
      } else {
        let description
        if (fields.type === Enums.DISCORD) {
          description = `Added new discord user ${res.discordUserDiscriminator}`
        }
        if (fields.type === Enums.TWITTER) {
          description = `Added new twitter user ${res.twitterUserName}`
        }
        if (fields.type === Enums.WALLET) {
          description = `Added new user successfully`
        }
        toast({
          title: 'Succeed',
          description,
          position: 'bottom-right',
          status: 'success',
          duration: 3000,
        })
        resetForm()
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={UserSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ errors, status, touched, isValid, dirty, values }) => {
        return (
          <Form>
            <HalfPageWrapper>
              <Box w={{ base: '100%' }} minW="100%">
                <AdminCard py="8">
                  <SimpleGrid columns={1} rowGap={4} w="full">
                    <GridItem colSpan={1}>
                      <FormControl>
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                          User Type
                        </FormLabel>
                        <Field name="type" as={Select} fontSize="md" ms="4px" size="lg">
                          <option value={Enums.WALLET}>{Enums.WALLET}</option>
                          <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                          <option value={Enums.TWITTER}>{Enums.TWITTER}</option>
                        </Field>
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                      <FormControl isRequired isInvalid={errors.user && touched.user}>
                        <RequiredInput
                          label={'User Name'}
                          fieldName="user"
                          error={errors?.user}
                          touched={touched?.user}
                          placeholder="Wallet / Discord Id / Twitter User"
                          validate={(value) => {
                            let error

                            if (values?.type === Enums.WALLET && !utils.isAddress(value)) {
                              error = 'Invalid address checksum.'
                            }
                            if (
                              (values?.type === Enums.DISCORD || values?.type === Enums.TWITTER) &&
                              value?.length < 1
                            ) {
                              error = 'User cannot be blank.'
                            }
                            return error
                          }}
                        />
                      </FormControl>
                    </GridItem>

                    {status && (
                      <Text fontSize="md" color="red.300" width={'100%'}>
                        {status}
                      </Text>
                    )}
                  </SimpleGrid>

                  <Flex justifyContent="center" mt="24px">
                    <Button
                      w="50%"
                      variant="blue"
                      type="submit"
                      disabled={!dirty || isAdding}
                      isLoading={isAdding}
                    >
                      Submit
                    </Button>
                  </Flex>
                </AdminCard>
              </Box>
            </HalfPageWrapper>
          </Form>
        )
      }}
    </Formik>
  )
}

export default AddNewUser
