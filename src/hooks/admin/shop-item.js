import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useAdminShopQuery = () => {
  const { data, isLoading } = useQuery(
    'shop-query',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/reward/shop/query`).then((r) => r.data)
    },
    { staleTime: 60 },
  )

  return { data, isLoading }
}

export const useShopItemMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`/api/admin/reward/shop/mutate`, payload)
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



export const useShopItemPause = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`/api/admin/reward/shop/pause`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('shop-query')
      },
    },
  )

  return { data, isLoading, mutateAsync }
}