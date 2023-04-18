import { prisma } from "@context/PrismaContext"
import publicMiddleware from "@middlewares/publicMiddleware";
import { Reward } from "@prisma/client"
import { getUserByType } from "@repositories/user";
import type { NextApiResponse } from 'next';
/**
 * @swagger
 * /api/public/reward:
 *   get:
 *     description: Returns all user rewards
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
 *                 $ref: '#/components/schemas/Reward'
 */
const publicGetUserReward = async (req, res: NextApiResponse<Reward[] | {isError:boolean, message: string}>) => {
  const { method } = req
  const {user, type}= req.query

  try {
    
    const appUser = await getUserByType(user, type);
    
    if(!appUser){
      return res.status(200).json({isError:true, message:`User ${user} not found`})
    }

    const reward:Reward[] = await prisma.reward.findMany({
      where: { userId: appUser.userId },
      include: { rewardType: true },
    })

    res.status(200).json(reward)
  } catch (error) {
    console.log(error)
    res.status(200).json({ isError: true, message: error.message })
  }
}

export default publicMiddleware(publicGetUserReward)

