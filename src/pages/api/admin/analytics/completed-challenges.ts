import { prisma } from 'context/PrismaContext'

// Utils
import adminMiddleware from '@middlewares/adminMiddleware'
import getMeaningfulQuestName from '@util/getMeaningfulQuestName'

// Types
import { CompletedQuest } from '@components/admin/analytics/views/CompletedChallenges/types'
import { Quest } from '@models/quest'
import { NextApiRequest, NextApiResponse } from 'next'

const RECORDS_TO_LIMIT = 5

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  if (method !== 'GET') {
    return res.status(200).json({ isError: true, message: 'Only for GET' })
  }

  try {
    const userCount: number = await prisma.whiteList.count()
    const quests: any = await prisma.quest.findMany({
      include: {
        _count: {
          select: { userQuests: true },
        },
        type: true,
      },
      orderBy: {
        userQuests: {
          _count: 'desc',
        },
      },
      take: RECORDS_TO_LIMIT,
    })
    const result: CompletedQuest[] = quests.map((quest) => {
      const finished = quest?._count?.userQuests ?? 0
      const r: CompletedQuest = {
        name: getMeaningfulQuestName(quest as Quest),
        finished,
        rate: parseFloat(((finished / userCount) * 100).toPrecision(2)),
      }

      return r
    })

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=7200, stale-while-revalidate')
    res.status(200).json(result)
  } catch (err) {
    res.status(200).json({ isError: true, message: err.message })
  }
}

export default adminMiddleware(handler)
