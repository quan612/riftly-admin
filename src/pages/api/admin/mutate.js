import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const mutateAdminAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { id, username, wallet, isUpdating } =
          req.body

        if (!isUpdating) {
          let existing = await prisma.Admin.findUnique({
            where: {
              wallet,
            },
          })

          if (existing) {
            return res.status(200).json({
              message: `Cannot add more than one admin: "${wallet}".`,
              isError: true,
            })
          }
        }

        await prisma.Admin.upsert({
          where: {
            id: id || -1,
          },
          create: {
            username,
            wallet
          },
          update: {
            username,
            wallet
          },
        })

        res.status(200).json({ isError: false, message: 'Update succeed.' })
      } catch (err) {
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default adminMiddleware(mutateAdminAPI)
