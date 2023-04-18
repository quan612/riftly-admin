import React from 'react'

import {
  Box,
  Flex,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  RadioGroup,
  SimpleGrid,
  GridItem,
  InputGroup,
  Image,
  Text,
  Divider,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { HeadingLg, HeadingSm, TextMd, TextSm } from '@components/shared/Typography'
import { Field, Form } from 'formik'
import RiftlyRadio from '@components/shared/Radio'

import { RequiredTextAreaInput, RequiredInput, NonRequiredTextAreaInput } from '@components/shared/Formik'
import { ItemType, ContractType } from '@prisma/client'
import { capitalizeFirstLetter } from '@util/index'
import AdminGeneralImageUpload from '@components/shared/ImageUpload/AdminGeneralImageUpload'
import RequirementsFormArray from '@components/shared/RequirementsFormArray'

const ShopItemFormWrapper = ({
  isCreate,
  isLoading,
  status,
  values,
  errors,
  touched,
  dirty,
  setFieldValue,
  handleChange,
  children,
}) => {
 
  return (
    <Form>
      <Flex
        w={{ base: '100%' }}
        maxW="container.md"
        flexDirection="column"
        gap="20px"
        mb="24px"
        className="item-shop-container"
      >
        <AdminCard>
          <Flex direction="column" gap="20px">
            <HeadingLg>Setup</HeadingLg>
            <TextMd color="brand.neutral2">
              Choose the type of shop item and set up contract details if necessary.
            </TextMd>

            <FormControl>
              <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                Select Item Type
              </FormLabel>

              <RadioGroup onChange={(e) => setFieldValue('itemType', e)} value={values?.itemType}>
                <Flex gap="1rem">
                  <RiftlyRadio value={ItemType.OFFCHAIN} isDisabled={!isCreate}>Off Chain - No Contract</RiftlyRadio>
                  <RiftlyRadio value={ItemType.ONCHAIN} isDisabled={!isCreate}>On Chain - With Contract</RiftlyRadio>
                </Flex>
              </RadioGroup>
            </FormControl>

            {values.itemType === ItemType.ONCHAIN && (
              <>
                <FormControl>
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    Select Your Contract Type
                  </FormLabel>
                  <Select
                    name="type"
                    as={Select}
                    fontSize="md"
                    ms="4px"
                    size="lg"
                    value={values?.contractType}
                    borderRadius="48px"
                    isDisabled={!isCreate}
                    onChange={(e) => {
                      e.preventDefault()
                      // questTypeSelect(e.target.value)
                      setFieldValue("contractType", e.target.value)
                    }}
                    // onChange={handleChange}
                  >
                    {[ContractType.ERC20, ContractType.ERC721]?.map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      )
                    })}
                  </Select>
                </FormControl>
                <RequiredInput
                  label={'Contract Id'}
                  fieldName="contractAddress"
                  error={errors?.contractAddress}
                  touched={touched?.contractAddress}
                />

              <GridItem colSpan={2}>
                <NonRequiredTextAreaInput
                  label={'Contract Abi'}
                  fieldName="abi"
                  error={errors?.abi}
                  touched={touched?.abi}
                  placeholder="Contract Abi"
                  height="150px"
                />
              </GridItem>
              </>
            )}
          </Flex>
        </AdminCard>

        {/* Item image Upload */}

        <AdminCard p="0" px="24px">
          <AdminGeneralImageUpload
            title={'Item Image'}
            error={errors?.image}
            touched={touched?.image}
            uploaded={values?.image}
            onConfirmUpload={(imageUrl) => {
              // dont clear the field on cancel, no way to re-upload old file
              setFieldValue('image', imageUrl)
            }}
            minH={{ base: 'auto', lg: '420px', '2xl': '365px' }}
          />
        </AdminCard>

        {/* Shop Item information */}
        <AdminCard>
          <Flex direction="column">
            <SimpleGrid columns={2} columnGap={8} rowGap={4} w="full" gap="12px">
              <GridItem colSpan={2}>
                <Flex direction="column" gap="20px">
                  <HeadingLg>Item Information</HeadingLg>

                  <Box>
                    <TextSm color="brand.neutral2">
                      Let your users know more about this Shop Item.
                    </TextSm>
                    <TextSm color="brand.neutral2">
                      These information can be edited after publishing.
                    </TextSm>
                  </Box>
                </Flex>
              </GridItem>

              {children}

              <GridItem colSpan={2}>
                <RequiredInput
                  label={'Title'}
                  fieldName="title"
                  error={errors?.title}
                  touched={touched?.title}
                  placeholder="Name of Item"
                />
              </GridItem>

              <GridItem colSpan={2}>
                <RequiredTextAreaInput
                  label={'Description'}
                  fieldName="description"
                  error={errors?.description}
                  touched={touched?.description}
                  placeholder="Description of Item"
                />
              </GridItem>

              {/* Requirements */}

              <GridItem colSpan={{ base: 2 }}>
                <RequirementsFormArray
                  requirements={values?.requirements}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  errors={errors}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <RequiredInput
                  label={'Available Quantity Slot'}
                  fieldName="available"
                  error={errors?.available}
                  touched={touched?.available}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <RequiredInput
                  label={'Maximum Redeemable Slot Per Account'}
                  fieldName="maxPerAccount"
                  error={errors?.maxPerAccount}
                  touched={touched?.maxPerAccount}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <RequiredInput
                  label={'Amount to redeem per slot (Multiplier - Only affect erc20)'}
                  fieldName="multiplier"
                  error={errors?.multiplier}
                  touched={touched?.multiplier}
                />
              </GridItem>
            </SimpleGrid>
          </Flex>
        </AdminCard>

        <ShopItemPreview values={values} status={status} dirty={dirty} isCreate={isCreate}/>
      </Flex>

      {process.env.NODE_ENV !== 'production' && (
        <>
          <p>Values:</p>
          <pre>
            <code>{JSON.stringify(values, null, 2)}</code>
          </pre>
          <p>Errors:</p>
          <pre>
            <code>{JSON.stringify(errors, null, 2)}</code>
          </pre>
        </>
      )}
    </Form>
  )
}

export default ShopItemFormWrapper
/* Shop Item Preview */
const ShopItemPreview = ({ values, status, dirty, isCreate}) => {
  return (
    <AdminCard bg="transparent" border="1px solid" borderColor="brand.neutral3">
      <Flex direction="column" gap="20px">
        <HeadingLg>Shop Item Preview</HeadingLg>
        <TextMd color="brand.neutral2">
          Confirm that all information is correct and publish your shop item.
        </TextMd>
        <Flex w="100%" align="center" justify="center">
          <ShopItem values={values} />
        </Flex>

        {status && (
          <Text color="red.300" w="100%">
            {status}
          </Text>
        )}
      </Flex>

      <Flex justifyContent="center" mt="32px">
        <Button variant="blue" type="submit" minW="60%" disabled={!dirty}>
        {isCreate ? " Add to Shop" : "Update Shop Item"} 
        </Button>
      </Flex>
    </AdminCard>
  )
}

const ShopItem = ({ values }) => {
  const { title, description, image } = values

  return (
    <Box bg={'brand.neutral4'} borderRadius="16px" h="259px" w="auto" minW="200px" maxW="33%">
      <Flex direction={{ base: 'column' }} h="100%">
        <Box
          position="relative"
          h="99px"
        >
          <Image
            boxSize={'100%'}
            src={image || "/img/user/feature-2.png"}
            w={'100%'}
            borderTopRadius="16px"
            fit={'cover'}
          />
        </Box>
        <Flex flexDirection="column" pt="16px" px="12px" flex="1" gap="4px">
          <Flex justify="space-between">
            <Flex direction="column" gap="5px">
              <HeadingSm color={'white'} fontWeight="bold" noOfLines={'2'}>
                {title}
              </HeadingSm>

              <TextSm color="whiteAlpha.700" opacity="0.64" fontWeight="400" noOfLines={'2'}>
                {description}
              </TextSm>
            </Flex>
          </Flex>
          <Flex align="start" alignItems={'center'} justify="space-between" mt="auto" pb="6px">
            <Flex alignItems={'center'} gap="5px">
              {/* <Box maxH="24px" h="33%" position={'relative'} boxSize="16px">
          <RiftlyIcon fill={'#1D63FF'} />
        </Box>
        <HeadingLg fontWeight="700" color={'white'}>
         100
        </HeadingLg> */}
            </Flex>

            <Button maxW="95px" variant="blue" borderRadius="48px" px="12px" py="5px">
              Redeem
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
