import {
  getFirstDayCurMonth,
  getFirstDayPrevMonth,
  getLastDayCurMonth,
  getLastDayPrevMonth,
} from '@util/index'
import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'


const adminUsersCountAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        let aggregatedUserStatistic = {}

        const usersCount = await prisma.whiteList.count()
        aggregatedUserStatistic.usersCount = usersCount

        const whitelistData = await prisma.whiteListUserData.findMany()


        const usersETH = whitelistData.reduce((accumulator, row) => {
          let eth = parseFloat(row?.eth) || 0.0
          return parseFloat(accumulator) + eth
        }, 0.0)

        aggregatedUserStatistic.usersETH = usersETH.toFixed(2)

        const firstDayPrevMonth = getFirstDayPrevMonth()
        const lastDayPrevMonth = getLastDayPrevMonth()
        const firstDayCurMonth = getFirstDayCurMonth()
        const lastDayCurMonth = getLastDayCurMonth()

        const newUsersLastMonth = await prisma.whiteList.count({
          where: {
            AND: [
              {
                createdAt: {
                  gte: firstDayPrevMonth,
                },
              },
              {
                createdAt: {
                  lte: lastDayPrevMonth,
                },
              },
            ],
          },
        })

        const newUsersThisMonth = await prisma.whiteList.count({
          where: {
            AND: [
              {
                createdAt: {
                  gte: firstDayCurMonth,
                },
              },
              {
                createdAt: {
                  lte: lastDayCurMonth,
                },
              },
            ],
          },
        })

        aggregatedUserStatistic.newUsers = {
          newUsersLastMonth,
          newUsersThisMonth,
          growth: ((newUsersThisMonth - newUsersLastMonth) / newUsersThisMonth) * 100,
        }

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=600, stale-while-revalidate')
        res.status(200).json(aggregatedUserStatistic)
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default adminMiddleware(adminUsersCountAPI)
