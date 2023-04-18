import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useRedeemableContractQuery = () => {
  const { data, status, isLoading, error } = useQuery(
    'redeemable-contract-query',
    () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/settings/redeemable-contract/`).then((r) => r.data)
    },
    { staleTime: 60 * 60 },
  )

  return [data, isLoading]
}

export const useAdminRedeemableContractMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/settings/redeemable-contract/upsert`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('redeemable-contract-query')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}
