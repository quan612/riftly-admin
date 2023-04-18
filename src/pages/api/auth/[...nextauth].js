import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import {
  recoverPersonalSignature,
  recoverTypedSignature,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util'
import * as ethUtil from 'ethereumjs-util'
import { prisma } from '@context/PrismaContext'
import { utils } from 'ethers'
import Enums from 'enums'

const CryptoJS = require('crypto-js')

const { NEXTAUTH_SECRET } = process.env


export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'admin-authenticate',
      name: 'admin-authenticate',
      type: 'credentials',

      authorize: async (credentials, req) => {
        try {
          const { address, signature } = credentials
          if (!address || !signature) throw new Error('Missing address or signature')

          let wallet = utils.getAddress(address)
          if (!wallet && !utils.isAddress(address)) throw new Error('Invalid wallet address')

          const admin = await prisma.admin.findUnique({
            where: {
              wallet,
            },
          })

          if (!admin) throw new Error('Wallet address not belong to any admin!')

          const nonce = admin.nonce.trim()
          const msg = `${Enums.ADMIN_SIGN_MSG}: ${nonce}`

          const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'))
          const originalAddress = recoverPersonalSignature({
            data: msgBufferHex,
            signature: signature,
          })

          if (originalAddress.toLowerCase() !== address.toLowerCase())
            throw new Error('Signature verification failed')

          const newNonce = CryptoJS.lib.WordArray.random(16).toString()

          let res = await prisma.Admin.update({
            where: {
              //wallet: { equals: originalAddress.toLowerCase(), mode: "insensitive" },
              id: admin.id,
            },
            data: {
              nonce: newNonce,
            },
          })

          if (!res) {
            console.error('cannot update new nonce')
          }

          return { address: originalAddress, username: admin?.username, isAdmin: true }
        } catch (error) {
          throw new Error(error)
        }
      },
    }),
  ],
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 4, // 7 days
  },
  jwt: {
    signingKey: NEXTAUTH_SECRET,
  },
  callbacks: {
    signIn: async (user, account, profile) => {
      if (user?.account?.provider === 'admin-authenticate') {
        return true
      }

      return false
    },
    async redirect({ url, baseUrl }) {
      return url
    },
    async jwt({ token, user, account, profile }) {
      if (user) {

        token.profile = profile
        token.user = user
        token.provider = account?.provider
      }

      return token
    },
    async session({ session, token }) {
      if (token.provider === 'admin-authenticate') {

        session.profile = token.profile || null
        session.user = token.user
        session.provider = token.provider
        return session
      }

    },
  },
  secret: NEXTAUTH_SECRET,
}

export default (req, res) => {
  if (process.env.VERCEL) {
    // prefer NEXTAUTH_URL, fallback to x-forwarded-host
    req.headers['x-forwarded-host'] = process.env.NEXTAUTH_URL || req.headers['x-forwarded-host']
  }
  return NextAuth(req, res, authOptions)
}
