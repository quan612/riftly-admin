import { prisma } from "@context/PrismaContext"
import publicMiddleware from "@middlewares/publicMiddleware";
import { Reward } from "@prisma/client"
import { getUserByType } from "@repositories/user";
import { WhiteList } from "models/whitelist";
import type { NextApiResponse } from 'next';
/**
 * @swagger
 * /api/public/user:
 *   get:
 *     description: Returns user info
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
 *               type: object
 *               $ref: '#/components/schemas/WhiteList'
 */
const publicGetUserReward = async (req, res: NextApiResponse<WhiteList | {isError:boolean, message: string}>) => {
  const {user, type}= req.query

  try {
    const appUser: WhiteList = await getUserByType(user, type);
    res.status(200).json(appUser)
  } catch (error) {
    res.status(200).json({ isError: true, message: error.message })
  }
}

export default publicMiddleware(publicGetUserReward)

