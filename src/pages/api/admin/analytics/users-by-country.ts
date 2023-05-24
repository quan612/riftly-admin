import { prisma } from '@context/PrismaContext'

// Utils
import adminMiddleware from '@middlewares/adminMiddleware'
import { analyticsDataClient } from '@context/GoogleApisContext'

// Types
import { NextApiRequest, NextApiResponse } from 'next'
import { QuestVariables } from '@prisma/client'
import { UsersByCountryDef } from '@components/admin/analytics/views/UsersByCountry/types'
import { google } from '@google-analytics/data/build/protos/protos'

const START_DATE = '2023-01-01'
const END_DATE = 'yesterday'
const RECORDS_TO_TAKE = 5

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  if (method !== 'GET') {
    return res.status(200).json({ isError: true, error: 'only GET' })
  }

  const variables: QuestVariables = await prisma.questVariables.findFirst()
  const { googlePropertyId } = variables
  if (!variables) {
    return res.status(200).json({ isError: true, error: 'Missing analytics config' })
  }
  let client;
  try {
    client = await analyticsDataClient()
  } catch (error) {
    console.log(error)
    return res.status(200).json({ isError: true, error: 'Missing analytics config' })
  }

  
  let transformedData: UsersByCountryDef[]
  try {
    const [response] = await client.runReport({
      property: `properties/${googlePropertyId}`,

      dimensions: [
        {
          name: 'country',
        },
      ],
      metrics: [
        {
          name: 'totalUsers',
        },
      ],
      dateRanges: [
        {
          startDate: START_DATE,
          endDate: END_DATE,
        },
      ],
    })
    transformedData = transformGoogleResponse(response).slice(0, RECORDS_TO_TAKE)
  } catch (err) {
    // errors here are due to google analytics misconfig
    console.log(err)
    return res.status(200).json({ isError: true, message: err.message })
  }

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=10, stale-while-revalidate')
  res.status(200).json(transformedData)
}

export default adminMiddleware(handler)

const transformGoogleResponse = (response: google.analytics.data.v1beta.IRunReportResponse) => {
  const temp: UsersByCountryDef[] = []
  const total = parseInt(response.rows[0].metricValues[0].value) ?? 1
  for (let i = 0; i < response.rows.length; i++) {
    const country = response.rows[i].dimensionValues[0].value
    const users = parseInt(response.rows[i].metricValues[0].value)
    const percentage = parseFloat(((users / total) * 100).toFixed(2))
    temp.push({ country, users, percentage })
  }
  return temp
}
