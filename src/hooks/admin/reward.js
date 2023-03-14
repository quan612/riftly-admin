import { useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useAdminRewardSingleUser = () => {
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (pendingReward) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/reward/single`, pendingReward)
        .then((r) => r.data)
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useAdminBulkRewardsMutation = () => {
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`${Enums.BASEPATH}/api/admin/reward/bulk`, payload).then((r) => r.data)
    },
  )

  return [data, isLoading, mutateAsync]
}
