import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const AdminGetRedeemableContractHandler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {

        let contracts = await prisma.configRedeemableContract.findMany()
        return res.status(200).json(contracts)
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
export default adminMiddleware(AdminGetRedeemableContractHandler)
