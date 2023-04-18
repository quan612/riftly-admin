import { prisma } from "@context/PrismaContext"
import publicMiddleware from "@middlewares/publicMiddleware";
import { getUserByType } from "@repositories/user";
import { UserQuest } from "models/user-quest";
import type { NextApiResponse } from 'next';
/**
 * @swagger
 * /api/public/quest-completed:
 *   get:
 *     description: Returns all quest completed by an user
 *     security: 
*       - BearerAuth: []
 *     parameters:
 *      - in: query
 *        name: user
 *        schema:
 *          type: string
 *        required: true
 *        description: user indentifier
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *          enum: ["Wallet", "Discord", "Twitter", "Google", "Apple"]
 *        required: true
 *        description: type identifier
 *     responses:
 *       200:
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/components/schemas/UserQuest'
 */
const publicGetUserQuestCompleted = async (req, res: NextApiResponse<UserQuest[] | {isError:boolean, message: string}>) => {
  const {user, type}= req.query

  try {
    const appUser = await getUserByType(user, type);
    
    if(!appUser){
      return res.status(200).json({isError:true, message:`User ${user} not found`})
    }

    const userQuests:UserQuest[] | any = await prisma.userQuest.findMany({
      where: { userId: appUser.userId },
      include: { 
        quest:true,
        rewardType:true
        },
    })

    res.status(200).json(userQuests)
  } catch (error) {
    console.log(error)
    res.status(200).json({ isError: true, message: error.message })
  }
}

export default publicMiddleware(publicGetUserQuestCompleted)

