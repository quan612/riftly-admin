const { BetaAnalyticsDataClient } = require('@google-analytics/data')
import { prisma } from 'context/PrismaContext'

const analyticsClient = async () => {
  let variables = await prisma.questVariables.findFirst()
  if (!variables) {
    return null
  }
  const { googleClientEmail, googleClientId, googleProjectId } = variables

  if (
    googleClientEmail.trim().length < 1 ||
    googleClientId.trim().length < 1 ||
    googleProjectId.trim().length < 1 ||
    process.env.GOOGLE_ANALYTICS_PRIVATE_KEY.trim().length < 1
  ) {
    console.log("Missing google analytics configuration")
    throw new Error('Missing google analytics configuration.')
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: googleClientEmail,
      client_id: googleClientId,
      private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    },
    projectId: googleProjectId,
  })
}
export const analyticsDataClient = global.analyticsDataClient || analyticsClient;

if (process.env.NODE_ENV !== 'production') global.analyticsDataClient = analyticsClient
