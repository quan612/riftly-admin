import { prisma } from '@context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'
import { IntegrationType } from '@models/Integration-type'
import { ApiError } from 'next/dist/server/api-utils'

const handler = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    try {
      const webhooksubscribers = await prisma.webhookSubscriber.findMany()

      const quests = await prisma.quest.findMany();
      const shops = await prisma.shopItem.findMany();
      await Promise.all(webhooksubscribers.map(r => {
        if (r.type === IntegrationType.QUEST_ITEM) {
          const questIndex = quests.findIndex(q => parseInt(q.id) === r.eventId)
          if (questIndex !== -1) {
            r.associated = quests[questIndex]
          }
        }

        if (r.type === IntegrationType.SHOP_ITEM) {
          const shopIndex = shops.findIndex(q => parseInt(q.id) === r.eventId)
          if (shopIndex !== -1) {
            r.associated = shops[shopIndex]
          }
        }

        return r;
      }))

      return res.status(200).json(webhooksubscribers)
    } catch (error) {
      console.log(error)
      return res.status(200).json({ isError: true, message: error.message })
    }
  }
  throw new ApiError(400, `Method ${req.method} Not Allowed`)
}

export default adminMiddleware(handler)
