import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const AdminQuestQueryAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        let allQuests = await prisma.quest.findMany({
          where: {
            isDeleted: false,
          },
          include: {
            _count: {
              select: { userQuests: true },
            },
            type: true,
          },
        })

        return res.status(200).json(allQuests)
      } catch (err) {
        console.log(err)
        res.status(500).json({ err })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default adminMiddleware(AdminQuestQueryAPI)
