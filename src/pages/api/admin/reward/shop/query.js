import { prisma } from '@context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'
import { ApiError } from 'next/dist/server/api-utils'

const handler = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    try {
      const shopItems = await prisma.ShopItem.findMany({
        include: {
          // contract: true,
          requirements: true
        }
      })
      return res.status(200).json(shopItems)
    } catch (error) {
      return res.status(200).json({ isError: true, message: error.message })
    }
  }
  throw new ApiError(400, `Method ${req.method} Not Allowed`)
}

export default adminMiddleware(handler)
