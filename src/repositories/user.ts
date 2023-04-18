import { prisma } from '@context/PrismaContext'
import Enums from '@enums/index'
import { AccountStatus } from '@prisma/client'

export const getAccountStatusToAdd = async () => {
  const requiredSmsVerification = getIsSMSVerificationRequired()

  if (!requiredSmsVerification) {
    return AccountStatus.ACTIVE
  }
  return AccountStatus.PENDING
}
export const getIsSMSVerificationRequired = async () => {
  const allConfigs = await prisma.questVariables.findFirst()
  return allConfigs.requiredSmsVerification
}
export const getWhiteListUserByUserName = async (username) => {
  return await prisma.whiteList.findFirst({
    where: {
      OR: [
        {
          userId: username,
        },
        {
          discordId: username,
        },
        {
          twitterId: username,
        },
        {
          wallet: username,
        },
        {
          discordUserDiscriminator: username,
        },
        {
          twitterUserName: username,
        },
      ],
    },
  })
}
export const getWhiteListUserByWallet = async (wallet) => {
  return await prisma.whiteList.findUnique({
    where: {
      // wallet: { equals: wallet, mode: "insensitive" },
      wallet,
    },
  })
}
export const getWhiteListUserByUserId = async (userId) => {
  return await prisma.whiteList.findUnique({
    where: {
      userId,
    },
  })
}
export const getUserByType = async (user: string, type: string) => {
  switch (type.toString().toLowerCase()) {
    case Enums.WALLET.toLowerCase():
      return await prisma.whiteList.findUnique({
        where: { wallet: user },
      })
    case Enums.TWITTER.toLowerCase():
      return await prisma.whiteList.findFirst({
        where: { twitterUserName: user },
      })
    case Enums.DISCORD.toLowerCase():
      return await prisma.whiteList.findFirst({
        where: { discordUserDiscriminator: user },
      })
    case Enums.EMAIL.toLowerCase():
      return await prisma.whiteList.findUnique({
        where: { email: user },
      })
    default:
      return null;
  }
}
