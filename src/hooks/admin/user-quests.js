import { useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useAdminUserQuestsQuery = () => {
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/search/user-quests`, payload)
        .then((r) => r.data)
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useAdminUserQuestDelete = () => {
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/user-quest/delete`, payload)
        .then((r) => r.data)
    },
  )

  return [data, isLoading, mutateAsync]
}
