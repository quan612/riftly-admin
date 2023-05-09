import React from 'react'

import { Box, Table, Tbody, Th, Thead, Tr, Td } from '@chakra-ui/react'

import { useRewardTypesQuery } from '@hooks/admin/reward-types'
import { AdminCard } from '@components/shared/Card'
import { RiftlyCheckMark, RiftlyEditIcon } from '@components/shared/Icons'

const RewardTypes = ({ createRewardTypeSet }) => {
  const [rewardTypes, isLoadingRewardTypes] = useRewardTypesQuery()

  return (
    <Box w="100%" display={'flex'} flexDirection="column" gap="24px">
      <AdminCard>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Reward</Th>
              <Th>Preview</Th>
              {/* <Th>Icon</Th> */}
              <Th>Enabled</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rewardTypes &&
              rewardTypes?.map((rewardType, index) => {
                return (
                  <Tr key={index}>
                    <Td>{rewardType.reward}</Td>
                    <Td>
                      {rewardType?.rewardPreview?.length > 0 && (
                        <img src={`${rewardType?.rewardPreview}`} style={{ width: '120px' }} />
                      )}
                    </Td>
                    {/* <Td>
                      {rewardType?.rewardIcon?.length > 0 && (
                        <img src={`${rewardType?.rewardIcon}`} style={{ width: '50px' }} />
                      )}
                    </Td> */}
                    <Td>{rewardType?.isEnabled && <RiftlyCheckMark />}</Td>
                    <Td>
                      <RiftlyEditIcon
                        onClick={() => {
                          createRewardTypeSet({
                            id: rewardType.id,
                            reward: rewardType.reward,
                            rewardPreview: rewardType.rewardPreview,
                            isUpdating: true,
                            isEnabled: rewardType.isEnabled,
                          })
                        }}
                      />
                    </Td>
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </AdminCard>
    </Box>
  )
}

export default RewardTypes
