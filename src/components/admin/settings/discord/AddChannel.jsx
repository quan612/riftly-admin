import React from 'react'
import { Form, Formik } from 'formik'
import { object, string } from 'yup'

import { Heading, Box, Text, Button, SimpleGrid, GridItem, useToast } from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { useAdminDiscordChannelsMutation } from '@hooks/admin/settings'
import { RequiredInput } from '@components/shared/Formik'

const initialValues = {
  channel: '',
  channelId: '',
}

const CreateDiscordChannelSchema = object().shape({
  channel: string().required('Discord Channel is required'),
  channelId: string().required('Discord Channel Id required'),
})

function AddChannel() {
  const [data, isUpserting, upsertChannelAsync] = useAdminDiscordChannelsMutation()
  const toast = useToast()

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={CreateDiscordChannelSchema}
        onSubmit={async (fields, { setStatus, resetForm }) => {
          setStatus(null)
          const payload = {
            channel: fields.channel,
            channelId: fields.channelId,
            isEnabled: true,
            isDeleted: false,
            isCreated: true,
          }
          let upsertOp = await upsertChannelAsync(payload)

          if (upsertOp.isError) {
            setStatus(upsertOp.message)
          } else {
            resetForm()

            toast({
              title: 'Success',
              description: `Discord channel ${fields.channel} added!`,
              position: 'bottom-right',
              status: 'success',
              duration: 2000,
            })
          }
        }}
      >
        {({ errors, status, touched, dirty }) => (
          <Box w="100%">
            <Form>
              <AdminCard py="8">
                <SimpleGrid columns={1} rowGap={6} w="full">
                  <GridItem colSpan={1}>
                    <Heading color="#fff" size="md">
                      Add Channel
                    </Heading>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <RequiredInput
                      label={'Channel (#deep-sea-challenger)'}
                      fieldName="channel"
                      error={errors?.channel}
                      touched={touched?.channel}
                      placeholder="Channel name"
                    />
                  </GridItem>

                  <GridItem colSpan={1}>
                    <RequiredInput
                      label={' Channel Id'}
                      fieldName="channelId"
                      error={errors?.channelId}
                      touched={touched?.channelId}
                      placeholder="Channel Id"
                    />
                  </GridItem>

                  {status && (
                    <GridItem colSpan={1}>
                      <Text color="red.300" width={'100%'}>
                        {status}
                      </Text>
                    </GridItem>
                  )}

                  <GridItem colSpan={1}>
                    <Button
                      w={{ base: '150px' }}
                      type="submit"
                      variant="blue"
                      disabled={isUpserting || !dirty}
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

export default AddChannel
