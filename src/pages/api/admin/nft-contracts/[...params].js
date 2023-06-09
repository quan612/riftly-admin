import adminMiddleware from '@middlewares/adminMiddleware'

const Moralis = require('moralis').default
const ethers = require('ethers')


const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { params } = req.query
        let contract = params[0]
        let chainName = params[1]
        let cursor = params[2]
        let chainId = getChainId(chainName)

        if (!contract || !ethers.utils.getAddress(contract)) {
          return res.status(200).json({ isError: true, message: 'Missing valid contract query.' })
        }

        if (!Moralis.Core.isStarted) {
          await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
            // ...other configuration
          })
        }

        const response = await Moralis.EvmApi.nft
          .getNFTOwners({
            address: contract,
            chain: chainId,
            cursor,
          })
          .then((r) => r.jsonResponse)

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=120, stale-while-revalidate')
        res.status(200).json(response)
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, messasge: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default adminMiddleware(handler)

const getChainId = (chainName) => {
  // "eth", "polygon"
  switch (chainName) {
    case 'eth':
      return 1
    case 'polygon':
      return 137
    default:
      return 0
  }
}
