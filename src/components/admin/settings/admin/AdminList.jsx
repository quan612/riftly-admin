import React from 'react'

import { Box, Flex, Table, Tbody, Th, Thead, Tr, Td } from '@chakra-ui/react'

import { AdminCard } from '@components/shared/Card'
import { RiftlyEditIcon } from '@components/shared/Icons'
import { useAdminQuery } from '@hooks/admin/admin'
import Loading from '@components/shared/LoadingContainer/Loading'

const AdminList = ({ createDataSet }) => {
  const [admins, isLoadingAdmins] = useAdminQuery()

  return (
    <Box w="100%" display={'flex'} flexDirection="column" gap="24px">
      {isLoadingAdmins && <Loading />}
      <AdminCard>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Wallet</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {admins &&
              admins?.map((admin) => {
                const { id, username, wallet } = admin
                return (
                  <Tr key={id}>
                    <Td>{username}</Td>
                    <Td>{wallet}</Td>
                    <Td>
                      <RiftlyEditIcon
                        onClick={() => {
                          createDataSet({
                            id,
                            username,
                            wallet,
                            isUpdating: true,
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

export default AdminList
