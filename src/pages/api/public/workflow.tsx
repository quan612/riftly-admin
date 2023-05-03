
import { prisma } from "@context/PrismaContext"
import publicMiddleware from "@middlewares/publicMiddleware";
import { Reward } from "@prisma/client"
import { getUserByType } from "@repositories/user";
import { WhiteList } from "models/whitelist";
import type { NextApiResponse } from 'next';

const handler = async (req, res: NextApiResponse) => {
  const {webhookId, description, type, eventId, eventName, data}= req.body
console.log("req.body", req.body)

  try {
   
    res.status(200).json({message: "ok"})
  } catch (error) {
    res.status(200).json({ isError: true, message: error.message })
  }
}

export default (handler)