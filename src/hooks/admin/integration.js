import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

export const useWebhookQuery = () => {
  const { data, isLoading } = useQuery(
    'webhook-query',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/settings/integrations/webhook/query`).then((r) => r.data)
    },
    { staleTime: 60 },
  )

  return { data, isLoading }
}

export const useWebhookMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`/api/admin/settings/integrations/webhook/mutate`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('webhook-query')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}
