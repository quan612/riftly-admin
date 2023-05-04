import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const handler = async (req, res) => {
  const { method } = req

  if (method !== 'POST') {
    return res.status(200).json({
      message: `POST only`,
      isError: true,
    })
  }

  try {
    const {
      id,
      url,
      description,

      type,
      eventId,
      // eventName,
      // isEnabled,
    } = req.body

    const createObj = {
      url,
      description,
      type,
      eventId: parseInt(eventId),
      // eventName,
      // isEnabled,
    }

    const updateObj = {
      url,
      description,
      type,
      eventId: parseInt(eventId),
      // eventName,
      // isEnabled,
    }

    const updatedWebhook = await prisma.webhookSubscriber.upsert({
      where: {
        id: id || -1,
      },
      create: createObj,
      update: updateObj,
    })

    res.status(200).json(updatedWebhook)
  } catch (err) {
    console.log(err)
    res.status(200).json({ isError: true, message: err.message })
  }
}

export default adminMiddleware(handler)
