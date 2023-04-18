import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { id, data } =
          req.body



        const nftContract = await prisma.NftContractData.update({
          where: { id },
          data: { data }
        })

        console.log(nftContract)

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

export default adminMiddleware(handler)
