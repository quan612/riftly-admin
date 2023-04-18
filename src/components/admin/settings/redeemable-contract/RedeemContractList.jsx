import React, { useState, useRef } from 'react'

import { Heading, Box, Flex, Table, Tbody, Th, Thead, Tr, Td } from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { RiftlyCheckMark, RiftlyEditIcon, RiftlyTooltip } from '@components/shared/Icons'
import { useRedeemableContractQuery } from '@hooks/admin/redeemable-contract'

const RedeemContractList = ({ createRedeemableContractSet }) => {
  const [redeemContracts, isLoadingContract] = useRedeemableContractQuery()

  return (
    <Box w="100%" display={'flex'} flexDirection="column" gap="24px">
      <AdminCard>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Contract</Th>
              <Th>Max Redeemable</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {redeemContracts &&
              redeemContracts?.map((row, index) => {
                return (
                  <Tr key={index}>
                    <Td>{row.contract}</Td>
                    <Td>{row?.maxRedeemable}</Td>
                    <Td>
                      <RiftlyEditIcon
                        onClick={() => {
                          createRedeemableContractSet({
                            id: row.id,
                            maxRedeemable: row.maxRedeemable,
                            contract: row.contract,
                            isCreate: false,
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

export default RedeemContractList
