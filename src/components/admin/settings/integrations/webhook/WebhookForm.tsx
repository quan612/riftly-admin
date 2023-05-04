import React, { useState, useEffect } from 'react'

import {
  Box,
  Flex,
  Button,
  Select,
  FormControl,
  FormLabel,
  SimpleGrid,
  GridItem,
  Image,
  useToast,
  ButtonGroup,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { HeadingLg, HeadingSm, TextMd, TextSm } from '@components/shared/Typography'
import { Field, Form } from 'formik'

import { RequiredInput } from '@components/shared/Formik'
import { capitalizeFirstLetter } from '@util/index'

import { IntegrationType } from '@models/Integration-type'
import { useAdminQuestsQuery } from '@hooks/admin/quest'
import Enums from '@enums/index'
import { useAdminShopQuery } from '@hooks/admin/shop-item'
import axios, { AxiosResponse } from 'axios'

const WebhookForm = ({
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
  const { data: quests, isLoading: isLoadingQuests } = useAdminQuestsQuery()
  const { data: shopItems, isLoading: isLoadingShopItem } = useAdminShopQuery()
  const toast = useToast()
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
        {/* <AdminCard>
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
                  <RiftlyRadio value={ItemType.OFFCHAIN} isDisabled={!isCreate}>
                    Off Chain - No Contract
                  </RiftlyRadio>
                  <RiftlyRadio value={ItemType.ONCHAIN} isDisabled={!isCreate}>
                    On Chain - With Contract
                  </RiftlyRadio>
                </Flex>
              </RadioGroup>
            </FormControl>
          </Flex>
        </AdminCard> */}

        {/* Webhook Item information */}
        <AdminCard>
          <Flex direction="column">
            <SimpleGrid columns={2} columnGap={8} rowGap={4} w="full" gap="12px">
              <GridItem colSpan={2}>
                <Flex direction="column" gap="20px">
                  <HeadingLg>Webhook Information</HeadingLg>

                  <Box>
                    <TextSm color="brand.neutral2">
                      Let your users config a webhook endpoint to get event dispatched.
                    </TextSm>
                    <TextSm color="brand.neutral2">
                      These information can be edited after publishing.
                    </TextSm>
                  </Box>
                </Flex>
              </GridItem>

              {children}

              {/* Type and Event */}
              {quests && shopItems && (
                <WebhookData
                  quests={quests}
                  shopItems={shopItems}
                  values={values}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                />
              )}

              <GridItem colSpan={2}>
                <RequiredInput
                  label={'Webhook Description'}
                  fieldName="description"
                  error={errors?.description}
                  touched={touched?.description}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <RequiredInput
                  label={'Endpoint URLs (~ http://localhost:3002/api/public/workflow)'}
                  fieldName="url"
                  error={errors?.url}
                  touched={touched?.url}
                  placeholder="Url endpoint to receive webhook"
                />
              </GridItem>

              <GridItem colSpan={2}>
                <ButtonGroup gap="1rem">
                  <Button
                    variant="blue-outline"
                    onClick={async () => {
                     
                       const res = await axios
                        .post(`/api/test-hook`, {
                          url: values.url,
                          webhookId: values.id,
                          description: values.description,
                          type: values.type,
                          eventName: values.eventName,
                          data: {
                            userId: 'example-userId',
                            // transactionHash:"0xe865a371743280269c3d146b181117b15f5cd303f1f37bc644ce83f56da1a785"
                          },
                        })
                        .then((response: AxiosResponse) => {
                         return response.data;
                        })

                        if (res.isError) {
                          toast({
                            title: 'Exception',
                            description: `The endpoint is not available or response status is not 200`,
                            position: 'bottom-right',
                            status: 'error',
                            duration: 2500,
                            isClosable: true,
                          })
                        } else {
                          toast({
                            title: 'Success',
                            description: `Ping Url successfully.`,
                            position: 'bottom-right',
                            status: 'success',
                            duration: 1000,
                          })
                          setFieldValue("okToSave", true)
                         
                        }
                    }}
                  >
                    Test Webhook
                  </Button>

                  <Button variant="blue" type="submit" w="125px" disabled={values?.okToSave !== true || !dirty}>
                    Save
                  </Button>
                </ButtonGroup>
              </GridItem>
            </SimpleGrid>
          </Flex>
        </AdminCard>
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

export default WebhookForm

const integrationTypes = [
  {
    id: 1,
    name: IntegrationType.SHOP_ITEM,
    value: IntegrationType.SHOP_ITEM,
  },
  {
    id: 2,
    name: IntegrationType.QUEST_ITEM,
    value: IntegrationType.QUEST_ITEM,
  },
]

const WebhookData = ({
  quests,
  shopItems,
  values,
  handleChange,
  setFieldValue,
  errors,
  touched,
}) => {
  const [eventOptions, eventOptionSet] = useState([])

  const getEventOptions = async (values) => {
    const options = (await getSubType(values.type)) as any[]

    eventOptionSet(options)

    let id;
    if(values.eventId === 0)
    {
      id = options?.[0]?.id
      setFieldValue(`eventId`, parseInt(id))
     } else{
      id===values.eventId;
    }

    let name
    if (values.type === IntegrationType.QUEST_ITEM) {
      const selectedIndex = quests.findIndex((r) => parseInt(r.id) === parseInt(id))
      name = quests[selectedIndex]?.text
    }
    if (values.type === IntegrationType.SHOP_ITEM) {
      const selectedIndex = shopItems.findIndex((r) => parseInt(r.id) === parseInt(id))
      name = shopItems[selectedIndex]?.title
    }
    setFieldValue('eventName', name)
  }

  const getSubType = (value) => {
    // Simulate async call
    return new Promise((resolve, reject) => {
      switch (value) {
        case IntegrationType.QUEST_ITEM:
          // quests = quests?.filter((q) => {
          //   if (
          //     q.type.name === Enums.DAILY_SHELL ||
          //     q.type.name === Enums.LIMITED_FREE_SHELL ||
          //     q.type.name === Enums.IMAGE_UPLOAD_QUEST ||
          //     q.type.name === Enums.UNSTOPPABLE_AUTH
          //   )
          //     return false
          //   return true
          // })
          resolve(quests)
          break
        case IntegrationType.SHOP_ITEM:
          resolve(shopItems)
          break
        default:
          resolve([])
      }
    })
  }

  const getOptionValue = (item, type) => {
    switch (type) {
      case IntegrationType.QUEST_ITEM:
        return getMeaningfulQuestName(item)
      case IntegrationType.SHOP_ITEM:
        return item?.title || item?.description
      default:
        return 'Select Event'
    }
  }

  useEffect(() => {
    if (values?.type !== '') {
      getEventOptions(values)
    }
  }, [values?.type])
  return (
    <Flex direction={'column'} gap="20px">
      <FormControl isRequired isInvalid={errors.type && touched.type}>
        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
          Type
        </FormLabel>
        <Field w="250px" id={`type`} name={`type`} as={Select} onChange={handleChange}>
          {integrationTypes.map((r) => {
            return (
              <option value={r.value} key={r.value}>
                {r.value}
              </option>
            )
          })}
        </Field>
      </FormControl>

      <FormControl isRequired isInvalid={errors.eventId && touched.eventId}>
        <FormLabel ms="4px" fontSize="md" fontWeight="bold">
          Topic to trigger
        </FormLabel>
        <Field
          w="250px"
          id={`eventId`}
          name={`eventId`}
          as={Select}
          onChange={(e) => {
            handleChange(e)
            const id = e.target.value
            let name
            if (values.type === IntegrationType.QUEST_ITEM) {
              const selectedIndex = quests.findIndex((r) => parseInt(r.id) === parseInt(id))
              name = quests[selectedIndex].text
            }
            if (values.type === IntegrationType.SHOP_ITEM) {
              const selectedIndex = shopItems.findIndex((r) => parseInt(r.id) === parseInt(id))
              name = shopItems[selectedIndex].title
            }
            setFieldValue('eventName', name)
          }}
        >
          {eventOptions.map((r) => {
            return (
              <option key={r.id} value={parseInt(r.id)}>
                {getOptionValue(r, values?.type)}
              </option>
            )
          })}
        </Field>
      </FormControl>
    </Flex>
  )
}

const getMeaningfulQuestName = (quest) => {
  const { text, type, extendedQuestData } = quest

  switch (type?.name) {
    case Enums.DISCORD_AUTH:
    case Enums.TWITTER_AUTH:
    case Enums.WALLET_AUTH:
      return text
    case Enums.JOIN_DISCORD:
      return `Join Discord server ${extendedQuestData.discordServer}`
    case Enums.TWITTER_RETWEET:
      return `Retweet tweet ${extendedQuestData.tweetId}`
    case Enums.FOLLOW_TWITTER:
      return `Follow twitter ${extendedQuestData.followAccount}`
    case Enums.FOLLOW_INSTAGRAM:
      return `Follow instagram ${extendedQuestData.followAccount}`
    case Enums.OWNING_NFT_CLAIM:
      return `Own an NFT ${extendedQuestData.nft}`
    // case Enums.IMAGE_UPLOAD_QUEST:
    case Enums.CODE_QUEST:
      return `Finished code quest event ${extendedQuestData.codeEvent}`
    default:
      return type?.name
  }
}

const ShopItem = ({ values }) => {
  const { title, description, image } = values

  return (
    <Box bg={'brand.neutral4'} borderRadius="16px" h="259px" w="auto" minW="200px" maxW="33%">
      <Flex direction={{ base: 'column' }} h="100%">
        <Box position="relative" h="99px">
          <Image
            boxSize={'100%'}
            src={image || '/img/user/feature-2.png'}
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
