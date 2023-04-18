import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'

const AdminMutateRedeemableContractHandler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { isCreate, id, contract, maxRedeemable } = req.body

        let existingContract = await prisma.ConfigRedeemableContract.findUnique({
          where: {
            contract,
          },
        })

        if (existingContract && isCreate) {
          return res.status(200).json({
            message: `Cannot add more than one contract with same address at: "${contract}".`,
            isError: true,
          })
        }

        let updatedContract = await prisma.ConfigRedeemableContract.upsert({
          where: {
            id: id || -1,
          },
          create: {
            contract,
            maxRedeemable: parseInt(maxRedeemable)
          },
          update: {
            contract,
            maxRedeemable: parseInt(maxRedeemable)
          },
        })

        res
          .status(200)
          .json(updatedContract)

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

export default adminMiddleware(AdminMutateRedeemableContractHandler)

