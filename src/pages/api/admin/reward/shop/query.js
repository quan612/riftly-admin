import { prisma } from '@context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'
import { RedeemStatus } from '@prisma/client'
import { getShopRequirementCost } from '@repositories/shop'
import { ApiError } from 'next/dist/server/api-utils'

const handler = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    try {
      const shopItems = await prisma.ShopItem.findMany({
        include: {
          shopItemRedeem: true,
          requirements: true
        }
      })

      if (shopItems && shopItems.length > 0) {

        await Promise.all(shopItems.map(async shop => {
          const redeemAvailable = shop?.shopItemRedeem?.filter(i => i.status === RedeemStatus.AVAILABLE)
          const { cost } = await getShopRequirementCost(shop.requirements);
          shop.cost = cost;
          shop.redeemAvailable = redeemAvailable.length;

          // delete shop.abi;
          return shop;
        }))
      }
      return res.status(200).json(shopItems)
    } catch (error) {
      console.log(error)
      return res.status(200).json({ isError: true, message: error.message })
    }
  }
  throw new ApiError(400, `Method ${req.method} Not Allowed`)
}

export default adminMiddleware(handler)
