import adminMiddleware from '@middlewares/adminMiddleware'
import { prisma } from '@context/PrismaContext'
import { analyticsDataClient } from '@context/GoogleApisContext'

async function googleAnalyticsPageViewsQuery(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        console.log(1)
        let client = await analyticsDataClient()
        let variables = await prisma.questVariables.findFirst()
        const { googlePropertyId } = variables

        const [response] = await client.runReport({
          property: `properties/${googlePropertyId}`,


          dimensions: [
            {
              name: 'pagePath',
            },
          ],
          metrics: [

            {
              name: 'screenPageViews',
            },

          ],
          dateRanges: [
            {
              startDate: '2023-01-01',
              endDate: 'today',
            },
          ],
        })

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=120, stale-while-revalidate')
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

export default adminMiddleware(googleAnalyticsPageViewsQuery)

