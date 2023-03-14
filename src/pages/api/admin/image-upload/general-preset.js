import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'
let cloudinary = require('cloudinary').v2

const AdminGeneralPresetImagePostAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { imageName, imageSrc } = req.body

        let variables = await prisma.configImageHosting.findFirst()
        const { cloudinaryKey, cloudinaryName, cloudinarySecret, generalPreset } = variables
        if (!cloudinaryKey || !cloudinaryName || !cloudinarySecret) {
          throw new Error('Missing upload configurations')
        }
        cloudinary.config({
          cloud_name: cloudinaryName,
          api_key: cloudinaryKey,
          api_secret: cloudinarySecret,
        })

        let uploaded = await cloudinary.uploader.upload(imageSrc, {
          public_id: imageName,
          upload_preset: generalPreset || '',
        })
        if (uploaded.secure_url) {
          return res.status(200).json({ image: uploaded.secure_url })
        }

        res
          .status(200)
          .json({ isError: true, message: 'Cannot upload preview image. Please contact administrator.' })

      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default adminMiddleware(AdminGeneralPresetImagePostAPI)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb' // Set desired value here
    }
  }
}
