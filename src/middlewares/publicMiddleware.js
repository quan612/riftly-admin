import { prisma } from "@context/PrismaContext";

const publicMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization || ''
    const authToken = token.match(/Bearer (.*)/)?.[1]

    const appConfig = await prisma.QuestVariables.findFirst();
    const apiKey = appConfig.apiKey;
    if (!apiKey) {
      return res.status(200).json({
        message: 'App missing Api Key config',
        isError: true,
      })
    }
    if (!authToken || apiKey !== authToken) {
      return res.status(200).json({
        message: 'Cannot authorize request',
        isError: true,
      })
    }

    return handler(req, res)
  }
}
export default publicMiddleware
