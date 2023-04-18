import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useNftContractsQuery = () => {
  const { data, status, isLoading, error } = useQuery(
    'nft-contracts-query',
    () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/nft-contracts/query`).then((r) => r.data)
    },
    { staleTime: 60 * 60 },
  )

  return [data, isLoading]
}

export const useNftContractsMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/nft-contracts/mutate`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('nft-contracts-query')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useNftContractsUpdateData = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/nft-contracts/update-data`, payload)
        .then((r) => r.data)
    },
  )

  return [data, isLoading, mutateAsync]
}
