import React, { useState, useEffect } from 'react'
import Enums from 'enums'

import {
  Box,
  Flex,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  Text,
  Divider,
} from '@chakra-ui/react'

import { Field, Form } from 'formik'
import { DeleteIcon, RiftlyIcon, RiftlyTooltip } from '@components/shared/Icons'
import { useAdminQuestsQuery } from '@hooks/admin/quest'
import { useEnabledRewardTypesQuery } from '@hooks/admin/reward-types'
import { v4 as uuid } from 'uuid'
import { RequirementType } from '@models/requirement-type'

const RequirementsFormArray = ({ requirements, handleChange, setFieldValue, errors }) => {
  const { data: quests, isLoading: isLoadingQuests } = useAdminQuestsQuery()
  const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery()
  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
        Requirements
      </FormLabel>

      <Flex flexDirection={'column'} gap="1rem">
        {rewardTypes &&
          quests &&
          quests.length > 0 &&
          requirements.map((r, index) => {
            return (
              <RequirementItem
                key={r.requirementId}
                requirementId={r.requirementId}
                quests={quests}
                requirements={requirements}
                index={index}
                rewardTypes={rewardTypes}
                setFieldValue={setFieldValue}
                errors={errors?.requirements?.[index]}
                handleChange={handleChange}
                handleOnDelete={(requirementId) => {
                  setFieldValue(
                    'requirements',
                    requirements.filter((re) => re.requirementId !== requirementId),
                  )
                }}
              />
            )
          })}
      </Flex>
      <Button
        variant="signIn"
        mt="24px"
        onClick={() => {
          setFieldValue('requirements', [
            ...requirements,
            {
              requirementId: uuid(),
              requirementType: '',
              relationId: 0,
              conditional: { has: 0 },
            },
          ])
        }}
      >
        Add More Requirements
      </Button>
    </FormControl>
  )
}

export default RequirementsFormArray

const requirementTypes = [
  {
    id: 0,
    name: 'Select Type',
    value: 'Select Type',
  },
  {
    id: 1,
    name: RequirementType.QUEST,
    value: RequirementType.QUEST,
  },
  {
    id: 2,
    name: RequirementType.REWARD,
    value: RequirementType.REWARD,
  },
  {
    id: 3,
    name: RequirementType.LOGIN,
    value: RequirementType.LOGIN,
  },
]

const loginRequirement = [
  {
    id: 1,
    value: 'Consecutive Days',
  },
]

const RequirementItem = ({
  requirementId,
  quests,
  requirements,
  errors,
  index,
  rewardTypes,
  handleChange,
  setFieldValue,
  handleOnDelete,
}) => {
  const [requirementOptions, requirementOptionSet] = useState([])

  const getSubType = (value) => {
    // Simulate async call
    return new Promise((resolve, reject) => {
      switch (value) {
        case RequirementType.QUEST:
          quests = quests?.filter((q) => {
            if (
              q.type.name === Enums.DAILY_QUEST ||
              q.type.name === Enums.LIMITED_FREE_POINT ||
              q.type.name === Enums.IMAGE_UPLOAD_QUEST ||
              q.type.name === Enums.UNSTOPPABLE_AUTH
            )
              return false
            return true
          })
          resolve(quests)
          break
        case RequirementType.REWARD:
          resolve(rewardTypes)
          break
        case RequirementType.LOGIN:
          resolve(loginRequirement)
          break
        default:
          resolve([])
      }
    })
  }
  const getRequirementOptionValue = (item, requirementType) => {
    switch (requirementType) {
      case RequirementType.REWARD:
        return item?.reward
      case RequirementType.QUEST:
        return getMeaningfulQuestName(item)
      case RequirementType.LOGIN:
        return item.value
      default:
        return 'Select Type'
    }
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

      case Enums.CODE_QUEST:
        return `Finished code quest event ${extendedQuestData.codeEvent}`
    }
    return 'Select a quest'
  }

  const getAssociation = async (requirementType) => {
    const options = (await getSubType(requirementType)) as any[]

    requirementOptionSet(options)
    // if (requirements?.[index].relationId === 0 || requirements?.[index].relationId === '0') {
      setFieldValue(`requirements[${index}].relationId`, options?.[0]?.id)
    // }
  }
  useEffect(() => {
    if (requirements?.[index].requirementType !== '') {
      getAssociation(requirements?.[index].requirementType)
    }
  }, [requirements?.[index].requirementType])

  return (
    <>
      <Flex gap="1rem">
        <Field
          w="135px"
          id={`requirements.[${index}].requirementType`}
          name={`requirements.[${index}].requirementType`}
          as={Select}
          onChange={handleChange}
        >
          {requirementTypes.map((r) => {
            return (
              <option value={r.value} key={r.value}>
                {r.value}
              </option>
            )
          })}
        </Field>
        {requirements?.[index].requirementType !== '' && (
          <Field
            w="315px"
            as={Select}
            id={`requirements.[${index}].relationId`}
            name={`requirements.[${index}].relationId`}
            onChange={handleChange}
          >
            {requirementOptions?.length > 0 &&
              requirementOptions?.map((r, i) => {
                return (
                  <option key={i} value={parseInt(r.id)}>
                    {getRequirementOptionValue(r, requirements?.[index].requirementType)}
                  </option>
                )
              })}
          </Field>
        )}

        {(requirements?.[index]?.requirementType === RequirementType.REWARD ||
          requirements?.[index]?.requirementType === RequirementType.LOGIN) && (
          <Field
            color="white"
            w="100px"
            as={Input}
            name={`requirements[${index}].conditional.has`}
            type="number"
          />
        )}

        <Box
          ml="auto"
          display="flex"
          alignItems={'center'}
          h="40px"
          color="red.300"
          onClick={() => {
            if (confirm(`Deleting this requirement?`)) {
              handleOnDelete(requirementId)
            }
          }}
          _hover={{ cursor: 'pointer', color: 'red.500' }}
        >
          <Box boxSize={{ base: '24px', xl: '24px' }}>
            <DeleteIcon />
          </Box>
        </Box>
      </Flex>
      <Divider />
      {errors && (
        <Text color={'red.300'}>
          {errors?.requirementType || errors?.relationId || errors?.conditional?.has}
        </Text>
      )}
    </>
  )
}
