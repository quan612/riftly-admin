import React, { useContext } from 'react'
import Enums from 'enums'

import {
  Box,
  Flex,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  SimpleGrid,
  GridItem,
  InputGroup,
  Tooltip,
} from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { HeadingLg, HeadingSm, TextMd, TextSm } from '@components/shared/Typography'
import { Field, Form } from 'formik'
import { RiftlyIcon, RiftlyTooltip } from '@components/shared/Icons'
import { AdminQuestFormContext } from '@context/AdminQuestFormContext'

import JoinDiscordQuestForm from './TemplateForms/JoinDiscordQuestForm'
import OwnNftQuestForm from './TemplateForms/OwnNftQuestForm'
import EnterCodeQuestForm from './TemplateForms/EnterCodeQuestForm'
import DailyQuestForm from './TemplateForms/DailyQuestForm'
import DiscordAuthQuestForm from './TemplateForms/DiscordAuthQuestForm'
import FreeLimitedQuestForm from './TemplateForms/FreeLimitedQuestForm'
import ImageUploadQuestForm from './TemplateForms/ImageUploadQuestForm'
import InstagramFollowQuestForm from './TemplateForms/InstagramFollowQuestForm'
import TwitterAuthQuestForm from './TemplateForms/TwitterAuthQuestForm'
import TwitterFollowQuestForm from './TemplateForms/TwitterFollowQuestForm'
import TwitterRetweetQuestForm from './TemplateForms/TwitterRetweetQuestForm'
import UnstoppableQuestForm from './TemplateForms/UnstoppableQuestForm'
import WalletAuthQuestForm from './TemplateForms/WalletAuthQuestForm'
import RiftlyRadio from '@components/shared/Radio'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import { RequiredTextAreaInput, RequiredInput } from '@components/shared/Formik'
import { QuestStyle, QuestDuration } from '@prisma/client'
import { capitalizeFirstLetter } from '@util/index'
import AdminGeneralImageUpload from '@components/shared/ImageUpload/AdminGeneralImageUpload'

const customDateInput = ({ value, onClick, onChange }, ref) => (
  <Input
    variant="riftly"
    autoComplete="off"
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
  />
)
customDateInput.displayName = 'DateInput'

const CustomInput = React.forwardRef(customDateInput)

export default function AddQuest() {
  const { questType } = useContext(AdminQuestFormContext)

  return (
    <>
      {questType === Enums.DAILY_SHELL && <DailyQuestForm />}
      {questType === Enums.DISCORD_AUTH && <DiscordAuthQuestForm />}
      {questType === Enums.CODE_QUEST && <EnterCodeQuestForm />}
      {questType === Enums.LIMITED_FREE_SHELL && <FreeLimitedQuestForm />}
      {questType === Enums.IMAGE_UPLOAD_QUEST && <ImageUploadQuestForm />}

      {questType === Enums.FOLLOW_INSTAGRAM && <InstagramFollowQuestForm />}
      {questType === Enums.JOIN_DISCORD && <JoinDiscordQuestForm />}
      {questType === Enums.OWNING_NFT_CLAIM && <OwnNftQuestForm />}

      {questType === Enums.TWITTER_AUTH && <TwitterAuthQuestForm />}
      {questType === Enums.FOLLOW_TWITTER && <TwitterFollowQuestForm />}
      {questType === Enums.TWITTER_RETWEET && <TwitterRetweetQuestForm />}

      {questType === Enums.UNSTOPPABLE_AUTH && <UnstoppableQuestForm />}
      {questType === Enums.WALLET_AUTH && <WalletAuthQuestForm />}
    </>
  )
}

export const AdminQuestFormWrapper = ({
  isCreate,
  isLoading,
  status,
  values,
  errors,
  touched,
  setFieldValue,
  children,
}) => {
  console.log('is create', isCreate)
  const { questTypeSelect, questType, questTypes, rewardTypes } = useContext(AdminQuestFormContext)
  return (
    <Form>
      <Flex
        w={{ base: '100%' }}
        maxW="container.md"
        flexDirection="column"
        gap="20px"
        mb="24px"
        className="create-new-quest-container"
      >
        <AdminCard>
          <Flex direction="column" gap="20px">
            <HeadingLg>Setup</HeadingLg>
            <TextMd color="brand.neutral2">
              Choose the quest you want to create and its style - Normal or Featured. Featured
              challenges will allow header image.
            </TextMd>

            <FormControl>
              <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                Select your challenge
              </FormLabel>
              <Select
                name="type"
                as={Select}
                fontSize="md"
                ms="4px"
                size="lg"
                value={questType}
                borderRadius="48px"
                onChange={(e) => {
                  e.preventDefault()
                  questTypeSelect(e.target.value)
                }}
                isDisabled={!isCreate}
              >
                {questTypes?.map((type, index) => {
                  return (
                    <option key={index} value={type.name}>
                      {type.name}
                    </option>
                  )
                })}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                Challenge style
              </FormLabel>

              <RadioGroup
                onChange={(e) => {
                  setFieldValue('style', e)
                }}
                value={values?.style}
              >
                <Flex gap="1rem">
                  <RiftlyRadio value={QuestStyle.NORMAL}>
                    {capitalizeFirstLetter(QuestStyle.NORMAL)}
                  </RiftlyRadio>
                  <RiftlyRadio value={QuestStyle.FEATURED}>
                    {capitalizeFirstLetter(QuestStyle.FEATURED)}
                  </RiftlyRadio>
                </Flex>
              </RadioGroup>
            </FormControl>
          </Flex>
        </AdminCard>

        {/* Feature Image Upload */}
        {values?.style === QuestStyle.FEATURED && (
          <AdminCard p="0" px="24px">
            <AdminGeneralImageUpload
              title={'Feature Image'}
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
        )}

        {/* Quest information */}
        <AdminCard>
          <Flex direction="column">
            <SimpleGrid columns={'2'} columnGap={8} rowGap={4} w="full" gap="12px">
              <GridItem colSpan={2}>
                <Flex direction="column" gap="20px">
                  <HeadingLg>Quest Information</HeadingLg>

                  <Box>
                    <TextSm color="brand.neutral2">
                      Let your users know more about this quest.
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
                  fieldName="text"
                  error={errors?.text}
                  touched={touched?.text}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <RequiredTextAreaInput
                  label={'Description'}
                  fieldName="description"
                  error={errors?.description}
                  touched={touched?.description}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    Reward Type
                  </FormLabel>
                  <Field
                    name="type"
                    as={Select}
                    fontSize="md"
                    ms="4px"
                    size="lg"
                    value={values.rewardTypeId}
                    onChange={(e) => {
                      e.preventDefault()
                      setFieldValue('rewardTypeId', e.target.value)
                    }}
                  >
                    {rewardTypes &&
                      rewardTypes.map((type, index) => {
                        return (
                          <option key={index} value={parseInt(type.id)}>
                            {type.reward}
                          </option>
                        )
                      })}
                  </Field>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <RequiredInput
                  label={'Reward Amount'}
                  fieldName="quantity"
                  type="number"
                  error={errors?.quantity}
                  touched={touched?.quantity}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                    Duration
                  </FormLabel>

                  <RadioGroup
                    onChange={(e) => setFieldValue('duration', e)}
                    value={values.duration}
                  >
                    <Flex gap="1rem">
                      <RiftlyRadio value={QuestDuration.ONGOING}>
                        {capitalizeFirstLetter(QuestDuration.ONGOING)}
                      </RiftlyRadio>
                      <RiftlyRadio
                        isDisabled={
                          values.type === Enums.DISCORD_AUTH ||
                          values.type === Enums.TWITTER_AUTH ||
                          values.type === Enums.WALLET_AUTH
                        }
                        value={QuestDuration.LIMITED}
                      >
                        <>
                          {(values.type === Enums.DISCORD_AUTH ||
                            values.type === Enums.TWITTER_AUTH ||
                            values.type === Enums.WALLET_AUTH) && (
                            <Tooltip
                              label="Disabled on quests that are On-going by nature"
                              aria-label="Disabled on quests that are On-going by nature"
                            >
                              {capitalizeFirstLetter(QuestDuration.LIMITED)}
                            </Tooltip>
                          )}
                          {values.type !== Enums.DISCORD_AUTH &&
                            values.type !== Enums.TWITTER_AUTH &&
                            values.type !== Enums.WALLET_AUTH &&
                            capitalizeFirstLetter(QuestDuration.LIMITED)}
                        </>
                      </RiftlyRadio>
                    </Flex>
                  </RadioGroup>
                </FormControl>
              </GridItem>

              {values.duration === QuestDuration.LIMITED && (
                <>
                  <GridItem colSpan={1}>
                    <FormControl
                      isInvalid={
                        errors?.extendedQuestData?.startDate &&
                        touched?.extendedQuestData?.startDate
                      }
                    >
                      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Start Date
                      </FormLabel>
                      <Field name="extendedQuestData.startDate">
                        {({ field, meta, form: { setFieldValue } }) => {
                          return (
                            <InputGroup className="dark-theme">
                              <DatePicker
                                autoComplete="off"
                                // minDate={field?.value || new Date()}
                                background="red"
                                {...field}
                                utcOffset={0}
                                onKeyDown={(e) => {
                                  e.preventDefault()
                                }}
                                // dateFormat="yyyy-MM-dd"
                                dateFormat="MM/dd/yyyy"
                                // dateFormat="MM-dd-yyyy"
                                selected={(field.value && new Date(field.value)) || null}
                                onChange={(val) => {
                                  setFieldValue(
                                    `extendedQuestData.startDate`,
                                    moment.utv(val).format('MM/DD/YYYY'),
                                  )
                                }}
                                className="react-datapicker__input-text"
                                customInput={<CustomInput />}
                              />
                            </InputGroup>
                          )
                        }}
                      </Field>
                      <FormErrorMessage fontSize="md" name={'extendedQuestData.startDate'}>
                        {errors?.extendedQuestData?.startDate}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl
                      isInvalid={
                        errors?.extendedQuestData?.endDate && touched?.extendedQuestData?.endDate
                      }
                    >
                      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        End Date
                      </FormLabel>
                      <Field name="extendedQuestData.endDate">
                        {({ field, meta, form: { setFieldValue } }) => {
                          return (
                            <InputGroup className="dark-theme">
                              <DatePicker
                                // minDate={field?.value || new Date()}
                                autoComplete="off"
                                background="red"
                                {...field}
                                utcOffset={0}
                                onKeyDown={(e) => {
                                  e.preventDefault()
                                }}
                                dateFormat="MM/dd/yyyy"
                                selected={(field.value && new Date(field.value)) || null}
                                onChange={(val) => {
                                  setFieldValue(
                                    `extendedQuestData.endDate`,
                                    moment(val).format('MM/DD/YYYY'),
                                  )
                                }}
                                className="react-datapicker__input-text"
                                customInput={<CustomInput />}
                              />
                            </InputGroup>
                          )
                        }}
                      </Field>
                      <FormErrorMessage fontSize="md" name={'extendedQuestData.endDate'}>
                        {errors?.extendedQuestData?.endDate}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </>
              )}
            </SimpleGrid>
          </Flex>
        </AdminCard>

        <QuestPreview
          text={values.text}
          description={values?.description}
          quantity={values?.quantity}
        />
      </Flex>
      {/* Debug */}
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

/* Quest Preview */
const QuestPreview = ({ text, description, quantity }) => {
  return (
    <AdminCard bg="transparent" border="1px solid" borderColor="brand.neutral3">
      <Flex direction="column" gap="20px">
        <HeadingLg>Quest Preview</HeadingLg>
        <TextMd color="brand.neutral2">
          Confirm that all information is correct and schedule your quest.
        </TextMd>
        <UserQuestBox text={text} description={description} quantity={quantity} />
      </Flex>
      <Flex justifyContent="center" mt="32px">
        <Button variant="blue" type="submit">
          Schedule Quest
        </Button>
      </Flex>
    </AdminCard>
  )
}

// This container would not work on < 400px, cannot resize less than this range
const UserQuestBox = ({ text, description, quantity }) => {
  return (
    <Box
      display={{ base: 'none', '2xs': 'block' }}
      h={{ base: '112px', md: '96px' }}
      maxH={{ base: '112px', md: '96px' }}
      w="100%"
      bg="brand.neutral4"
      border="1px solid"
      borderColor="brand.neutral3"
      borderRadius={'16px'}
    >
      <Box display="flex" w="100%">
        <Box
          className="reward-quantity-per-quest"
          w={{ base: '75px', lg: '96px' }}
          h={{ base: '112px', md: '96px' }}
          borderRight={'1px solid'}
          borderRightColor={'brand.neutral3'}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            h="60%"
            display="flex"
            flexDirection={'column'}
            justifyContent="space-evenly"
            alignItems={'center'}
          >
            <Box maxH="36px" h="33%" position={'relative'} boxSize="20px">
              <RiftlyIcon fill={'#1D63FF'} />
            </Box>
            <HeadingLg color={'#fff'}>{quantity}</HeadingLg>
          </Box>
        </Box>

        <Flex flex="1" className="user-quest-claim">
          <Box
            h="100%"
            display="flex"
            flexDirection={'row'}
            flex="1"
            px={{ base: '12px', md: '16px' }}
            alignItems="center"
          >
            <Box h="80%" display={'flex'} flex="1">
              <Flex alignItems="center" w="100%">
                <Flex flexDirection="column" me="2px" ps="5px" gap="6px" w="100%">
                  <HeadingSm color="#fff" noOfLines={2} maxW="95%">
                    {text}
                  </HeadingSm>
                  <TextSm color="whiteAlpha.700" opacity={0.64} noOfLines={2} maxW="95%">
                    {description}
                  </TextSm>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Flex>

        <Flex className="user-quest-button">
          <Flex h="100%" alignItems="center" pe="5px">
            <Button size={'xs'} minW="75px" maxW="120px" variant={'blue'}>
              {'Start'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
