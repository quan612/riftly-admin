import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const AdminConfigsUpsertAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const {
          id,
          cloudinaryName,
          cloudinaryKey,
          cloudinarySecret,
          generalPreset,
          avatarPreset
        } = req.body

        let env = process.env.VERCEL_ENV || 'development'

        let upsertRes = await prisma.configImageHosting.upsert({
          where: {
            id: id || -1,
          },
          create: {
            cloudinaryName,
            cloudinaryKey,
            cloudinarySecret,
            generalPreset,
            avatarPreset
          },
          update: {
            cloudinaryName,
            cloudinaryKey,
            cloudinarySecret,
            generalPreset,
            avatarPreset
          },
        })

        res.status(200).json({ isError: false, message: 'Update succeed.' })
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default adminMiddleware(AdminConfigsUpsertAPI)
