import { useQuery } from 'react-query'
import axios from 'axios'
import Enums from 'enums'
import { UsersByCountryDef } from './types'

export const useUsersByCountryQuery = () => {
  const { data, isLoading } = useQuery(
    'users-by-country',
    async () => {
      return axios.get<UsersByCountryDef[]>(`${Enums.BASEPATH}/api/admin/analytics/users-by-country`).then((r) => r.data)
    },
    { staleTime: 120 },
  )

  return { data, isLoading }
}