import adminMiddleware from '@middlewares/adminMiddleware'
import { prisma } from '@context/PrismaContext'
import axios from 'axios'
import { sleep } from '@util/index'

const AdminUpdateUsersFollowersAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { selectedRows } = req.body
        let variables = await prisma.questVariables.findFirst()
        const { twitterBearerToken } = variables

        if (!twitterBearerToken || twitterBearerToken.length < 10) {
          throw new Error('Missing Twitter Bearer Token')
        }

        for (let row of selectedRows) {
          await sleep(100)
          const { userId, twitterId } = row

          let followers = 0
          if (twitterId?.length > 5) {
            let twitterUserMetric = await axios
              .get(`https://api.twitter.com/2/users/${twitterId}?user.fields=public_metrics`, {
                headers: {
                  Authorization: `Bearer ${twitterBearerToken}`,
                  'Content-Type': 'application/json',
                },
              })
              .then((r) => r.data)
              .catch(function (error) {
                console.log(error)
              })

            if (twitterUserMetric && twitterUserMetric?.errors) {
              console.log(`found suspended account ${twitterId}`)
            }

            if (twitterUserMetric && twitterUserMetric.data?.public_metrics) {
              followers = twitterUserMetric.data.public_metrics.followers_count
            }
          }

          let lastFollowersUpdated = new Date(Date.now()).toISOString()
          await prisma.whiteListUserData.upsert({
            where: {
              userId,
            },
            update: {
              followers,
              lastFollowersUpdated,
            },
            create: {
              followers,
              lastFollowersUpdated,
              user: {
                connect: {
                  userId,
                },
              },
            },
          })
        }

        return res.status(200).json({ message: 'Followers refresh' })
      } catch (error) {
        console.log(error)
        return res.status(200).json({ isError: true, message: error.message })
      }
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default adminMiddleware(AdminUpdateUsersFollowersAPI)
