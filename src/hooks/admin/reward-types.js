import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useRewardTypesQuery = () => {
  const { data, status, isLoading, error } = useQuery(
    'rewardTypesQuery',
    () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/rewardType`).then((r) => r.data)
    },
    { staleTime: 60 * 60 },
  )

  return [data, isLoading]
}

export const useEnabledRewardTypesQuery = () => {
  const { data, status, isLoading, error } = useQuery(
    'rewardTypesQuery',
    () => {
      return axios
        .get(`${Enums.BASEPATH}/api/admin/rewardType`)
        .then((r) => r.data.filter((r) => r.isEnabled === true))
    },
    { staleTime: 60 * 60 },
  )

  return [data, isLoading]
}

export const useAdminRewardTypeMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/settings/reward-types/upsert`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rewardTypesQuery')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}
