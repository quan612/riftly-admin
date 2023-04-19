import React, { useState } from 'react'
import { Box, Flex, Table, Tbody, Th, Thead, Tr, Td, useToast } from '@chakra-ui/react'
import { AdminCard } from '@components/shared/Card'
import { RefreshIcon, RiftlyEditIcon } from '@components/shared/Icons'
import Loading from '@components/shared/LoadingContainer/Loading'
import { useNftContractsQuery, useNftContractsUpdateData } from '@hooks/admin/nft-contracts'
import { getNftOwners } from '@components/admin/user/list/helper'
import { utils } from 'ethers'
import { shortenAddress } from '@util/index'
import moment from 'moment'

const NftContractsList = () => {
  const [nftContracts, isLoadingnftContracts] = useNftContractsQuery()
  const [loading, loadingSet] = useState(false)
  const [data, isUpdating, updateAsync] = useNftContractsUpdateData()
  const toast = useToast()

  const handleUpdate = async (contract) => {
    const { id, name, address, chain } = contract
    loadingSet(true)
    try {
      const data = await getNftOwners(utils.getAddress(address), chain)

      const op = await updateAsync({ id, data })

      if (op.isError) {
        toast({
          title: 'Error',
          description: `Error: ${op.message}`,
          position: 'bottom-right',
          status: 'exception',
          duration: 2000,
        })
      } else {
        toast({
          title: 'Succeed',
          description: `Update nft contract ${name} data successful`,
          position: 'bottom-right',
          status: 'success',
          duration: 2000,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `${error.message}`,
        position: 'bottom-right',
        status: 'exception',
        duration: 2000,
      })
    }
    loadingSet(false)
  }

  return (
    <Box w="100%" display={'flex'} flexDirection="column" gap="24px">
      {(isLoadingnftContracts || loading) && <Loading />}
      <AdminCard>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Nft Address</Th>
              <Th>Chain</Th>
              <Th>Owners</Th>
              <Th>Last Updated</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {nftContracts &&
              nftContracts?.map((contract) => {
                const { id, name, address, chain, data, updatedAt } = contract

                return (
                  <Tr key={id}>
                    <Td>{name}</Td>
                    <Td>{shortenAddress(address)}</Td>
                    <Td>{chain}</Td>
                    <Td>{data.length}</Td>
                    <Td>{moment.utc(updatedAt).format('MM-DD-YYYY')}</Td>
                    <Td>
                      <RefreshIcon onClick={() => handleUpdate(contract)} />
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

export default NftContractsList
