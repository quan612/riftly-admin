import { useQuery } from 'react-query'
import axios from 'axios'
import Enums from 'enums'
import { CompletedQuest } from './types'

export const useCompletedQuestQuery = () => {
  const { data, isLoading } = useQuery(
    'shop-query',
    async () => {
      return axios.get<CompletedQuest[]>(`${Enums.BASEPATH}/api/admin/analytics/completed-challenges`).then((r) => r.data)
    },
    { staleTime: 120 },
  )

  return { data, isLoading }
}