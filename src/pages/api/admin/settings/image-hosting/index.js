import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const AdminConfigsQueryAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        let imageHostingConfigs = await prisma.configImageHosting.findFirst()

        return res.status(200).json(imageHostingConfigs)
      } catch (err) {
        console.log(err)
        res.status(500).json({ isError: true, message: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default adminMiddleware(AdminConfigsQueryAPI)
