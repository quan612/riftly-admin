import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useAdminShopQuery = () => {
  const { data, isLoading } = useQuery(
    'shop-query',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/reward/shop/query`).then((r) => r.data?.sort(sortByText))
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




/************************************* */

export const useAdminQuestUpsert = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, mutateAsync } = useMutation(
    'admin-quest-upsert',
    (quest) => axios.post(`${Enums.BASEPATH}/api/admin/quest/upsert`, quest).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-quests-query')
      },
    },
  )

  return { data, isLoading, mutateAsync }
}

export const useAdminQuestSoftDelete = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, mutateAsync } = useMutation(
    'adminQuestDelete',
    (id) => axios.post(`${Enums.BASEPATH}/api/admin/quest/delete`, id).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-quests-query')
      },
    },
  )

  const handleOnDelete = async (id) => {
    return await mutateAsync(id)
  }

  return [data, isLoading, handleOnDelete]
}


export const useAdminQuestTypesQuery = () => {
  const { data, isLoading } = useQuery(
    'admin-quest-types-query',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/quest/type`).then((r) => r.data)
    },
    { staleTime: 60 },
  )

  return { data, isLoading }
}


function sortByText(a, b) {
  if (a.text?.toLowerCase() < b.text?.toLowerCase()) {
    return -1
  }
  if (a.text?.toLowerCase() > b.text?.toLowerCase()) {
    return 1
  }
  return 0
}