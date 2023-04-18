import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const mutateNftContractsAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { id, name, address, isUpdating } =
          req.body

        if (!isUpdating) {
          let existing = await prisma.NftContractData.findUnique({
            where: {
              address,
            },
          })

          if (existing) {
            return res.status(200).json({
              message: `Cannot add more than one nft contract at: "${address}".`,
              isError: true,
            })
          }
        }

        await prisma.NftContractData.upsert({
          where: {
            id: id || -1,
          },
          create: {
            name,
            address
          },
          update: {
            name,
            address
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

export default adminMiddleware(mutateNftContractsAPI)
