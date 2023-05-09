import adminMiddleware from '@middlewares/adminMiddleware'
import { prisma } from '@context/PrismaContext'
import { analyticsDataClient } from '@context/GoogleApisContext'

async function googleAnalyticsUserSessionQuery(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        let client = await analyticsDataClient()
        let variables = await prisma.questVariables.findFirst()
        const { googlePropertyId } = variables

        const [response] = await client.runReport({
          property: `properties/${googlePropertyId}`,

          dimensions: [
            {
              name: 'week',
            },
          ],
          metrics: [
            {
              name: 'sessions',
            },
          ],
          dateRanges: [
            {
              startDate: '2023-01-01',
              endDate: 'today',
            },
          ],
          metricAggregations: ['TOTAL'],
        })

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=600, stale-while-revalidate')
        res.status(200).json(response)
      } catch (err) {
        res.status(200).json({ isError: true, error: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default adminMiddleware(googleAnalyticsUserSessionQuery)
