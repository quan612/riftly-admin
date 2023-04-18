import { prisma } from '@context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'
import { ApiError } from 'next/dist/server/api-utils'

const handler = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    try {

      const admins = await prisma.Admin.findMany()

      return res.status(200).json(admins)
    } catch (error) {
      return res.status(200).json({ isError: true, message: error.message })
    }
  }
  throw new ApiError(400, `Method ${req.method} Not Allowed`)
}

export default adminMiddleware(handler)
