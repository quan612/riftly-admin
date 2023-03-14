import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const AdminDiscordChannelsPostAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { id, channel, channelId } = req.body

        let newChannel = await prisma.discord.create({
          data: {
            channel,
            channelId,
            isEnabled: true,
            isDeleted: false,
          },
        })

        res.status(200).json({ isError: false, message: 'New discord channel created.' })
      } catch (err) {
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default adminMiddleware(AdminDiscordChannelsPostAPI)
