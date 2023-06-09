import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useAdminQuery = () => {
  const { data, status, isLoading, error } = useQuery(
    'admin-query',
    () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/query`).then((r) => r.data)
    },
    { staleTime: 60 * 60 },
  )

  return [data, isLoading]
}

export const useAdminMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/mutate`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-query')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}
