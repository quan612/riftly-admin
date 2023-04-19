import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'
import { QuestStyle, QuestDuration, ItemType, ContractType, RedeemStatus } from '@prisma/client'

const handler = async (req, res) => {
  const { method } = req

  if (method !== "POST") {
    return res.status(200).json({
      message: `POST only`,
      isError: true,
    })
  }

  try {
    const {
      id,
      isEnabled,
    } = req.body

    let updatedContract = await prisma.ShopItem.update({
      where: {
        id: id || -1,
      },
      data: {
        isEnabled: isEnabled,
      }
    })

    res.status(200).json(updatedContract)
  } catch (err) {
    console.log(err)
    res.status(200).json({ isError: true, message: err.message })
  }

}

export default adminMiddleware(handler)
