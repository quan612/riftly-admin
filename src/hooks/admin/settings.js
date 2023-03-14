import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'

const sortByChannel = (a, b) => {
  return a.channel.localeCompare(b.channel)
}

export const useAdminDiscordChannelsQuery = () => {
  const { data, isLoading } = useQuery(
    ['AdminDiscordChannelsQuery'],
    () => {
      return axios.get(`${Enums.BASEPATH}/api/admin/settings/discord-channels`).then((r) => {

        return r?.data?.sort(sortByChannel)
      })
    },
    { staleTime: 5 * 60 },
  )

  return [data, isLoading]
}

export const useEnabledAdminDiscordChannelsQuery = () => {
  const [data, isLoading] = useAdminDiscordChannelsQuery()

  return [data?.filter((r) => r.isEnabled === true), isLoading]
}

export const useAdminDiscordChannelsMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/settings/discord-channels/upsert`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('AdminDiscordChannelsQuery')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useAdminRequiredSMSQuery = () => {
  const { data, isLoading } = useQuery(
    ['requiredSMSQuery'],
    () => {
      return axios.get(`${Enums.BASEPATH}/api/required-sms`).then((r) => r.data)
    },
    { staleTime: 5 * 60 },
  )

  return [data, isLoading]
}

export const useAdminRequiredSMSMutation = () => {
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/admin/settings/required-sms`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requiredSMSQuery')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}
