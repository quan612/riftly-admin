import axios from 'axios'
import { ApiError } from 'next/dist/server/api-utils'

const handler = async (req, res) => {
  const { method } = req

  const { url, webhookId, description, type, eventName, data } = req.body

  const payload = {
    url, webhookId, description, type, eventName, data
  }
  try {
    const result = await axios
      .post(url, payload)

    if (result.status === 200) {
      return res.status(200).json({ message: 'ok' })
    } else {
      return res.status(200).json({ isError: true, message: 'Test endpoint does not return status 200' })
    }

  } catch (error) {
    console.log(error.message)
    return res.status(200).json({ isError: true, message: error.message })
  }
}

export default handler
