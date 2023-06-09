import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'
import { useRouter } from 'next/router'

export const useUserQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`${Enums.BASEPATH}/api/user/quest/submit`, payload).then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useCodeQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/code-quest`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useNftOwningQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/nft-quest`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useWalletAuthQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`${Enums.BASEPATH}/api/user/wallet-sign-up`, payload).then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const usePhoneNumberQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/send-phone-for-sms`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const usePhoneCodeQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/send-code-for-verification`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUserQuestClaim = () => {
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`/api/user/quest/claim`, payload).then((r) => r.data)
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUserOwningNftQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isLoading, mutateAsync } = useMutation(
    (quest) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/nft-quest`, quest)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userRewardQuery')
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUserUnstoppableAuthQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isLoading, mutateAsync } = useMutation(
    (quest) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/unstoppable-auth`, quest)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userRewardQuery')
        queryClient.invalidateQueries('userQueryQuest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUserImageQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isLoading, mutateAsync } = useMutation(
    (quest) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/image-upload`, quest)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userRewardQuery')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUserQuestQuery = () => {
  const { data, isLoading } = useQuery(
    'user-query-user-quest',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/user/quest/`).then((r) => r.data)
    },
    { staleTime: 60 },
  )

  return { data, isLoading }
}

export const useUserUnstoppableAuthQuestQuery = () => {
  const { data, isLoading } = useQuery(
    'user-query-unstoppable-quest',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/user/quest/unstoppable-quest`).then((r) => r.data)
    },
    { staleTime: 60 },
  )

  return { data, isLoading }
}

export const useUserImageQuestQuery = () => {
  const router = useRouter()
  const imageQuestEvent = typeof router.query?.eventName === 'string' ? router.query.eventName : ''

  const { data, isLoading } = useQuery(
    'user-query-image-quest',
    async () => {
      return axios
        .get(`${Enums.BASEPATH}/api/user/quest/image-quest?eventName=${imageQuestEvent}`)
        .then((r) => r.data)
    },
    { enabled: imageQuestEvent.length > 0, staleTime: 60 },
  )

  return { data, isLoading }
}

export const useUserOwningNftQuestQuery = () => {
  const router = useRouter()
  const nft = typeof router.query?.nft === 'string' ? router.query.nft : ''

  const { data, isLoading } = useQuery(
    'user-query-nft',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/user/quest/nft-quest?nft=${nft}`).then((r) => r.data)
    },
    { enabled: !!nft, staleTime: 60 },
  )

  return { data, isLoading }
}
