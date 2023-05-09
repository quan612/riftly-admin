import React, { useState, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'

import { ethers, utils } from 'ethers'
import axios from 'axios'
import Enums from 'enums'
import WalletConnectProvider from '@walletconnect/web3-provider'

const API_ADMIN = `${Enums.BASEPATH}/api/admin`

export const Web3Context = React.createContext()
export function Web3Provider({ session, children }) {
  const [web3Error, setWeb3Error] = useState(null)

  let signMessageTimeout, adminSignTimeout

  useEffect(() => {
    removeLocalStorageWalletConnect()
    document.addEventListener('visibilitychange', function () {
      localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
    })

    return () => {
      if (signMessageTimeout) {
        clearTimeout(signMessageTimeout)
      }
      if (adminSignTimeout) clearTimeout(adminSignTimeout)
    }
  }, [])

  useEffect(() => {
    if (session && window?.ethereum) {
      if (window?.ethereum) {
        subscribeProvider(window.ethereum)
      }
    }
  }, [session])

  const subscribeProvider = async (provider) => {
    try {
      provider.on('error', (e) => console.error('WS Error', e))
      provider.on('end', (e) => console.error('WS End', e))

      provider.on('accountsChanged', async (accounts) => {
        SignOut()
      })

      provider.on('chainChanged', async (chainId) => {
        SignOut()
      })

      provider.on('connect', (info) => {
        console.log('connected')
      })

      provider.on('disconnect', async (error) => {
        SignOut()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const adminSignIn = async (walletType) => {
    if (!walletType) {
      throw new Error('Missing type of wallet when trying to setup wallet provider')
    }

    let addresses, providerInstance
    if (walletType === Enums.METAMASK) {
      providerInstance = new ethers.providers.Web3Provider(window.ethereum)
      addresses = await providerInstance.send('eth_requestAccounts', [])
      subscribeProvider(window.ethereum)
    } else if (walletType === Enums.WALLETCONNECT) {
      let provider = new WalletConnectProvider({
        infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        qrcodeModalOptions: {
          mobileLinks: ['trust'],
          desktopLinks: ['encrypted ink'],
        },
      })
      await provider.enable()

      providerInstance = new ethers.providers.Web3Provider(provider)
      addresses = provider.accounts

      subscribeProvider(provider)
    }

    try {
      if (addresses.length === 0) {
        throw new Error('Account is locked, or is not connected, or is in pending request.')
      }

      const admin = await axios
        .get(API_ADMIN, {
          params: {
            address: addresses[0],
          },
        })
        .then((r) => r.data)

      if (!admin) {
        throw new Error('Cannot authenticate as admin with current wallet account')
      }

      const nonce = admin.nonce.trim()

      const promise = new Promise((resolve, reject) => {
        adminSignTimeout = setTimeout(async () => {
          const signer = await providerInstance.getSigner()
          let signature
          try {
            signature = await signer
              .signMessage(`${Enums.ADMIN_SIGN_MSG}: ${nonce}`)
              .catch((err) => {
                throw new Error('User rejects signing.')
              })
          } catch (error) {
            clearTimeout(adminSignTimeout)
            reject(error)
          }

          if (signature && addresses[0]) {
            signIn('admin-authenticate', {
              redirect: true,
              signature,
              address: addresses[0],
              callbackUrl: `${window.location.origin}/`,
            }).catch((error) => {
              reject(error.message)
            })
            clearTimeout(adminSignTimeout)
            resolve()
          }
          reject('Missing address or signature')
        }, 500)
      })
      return promise
    } catch (error) {
      if (error.message.indexOf('user rejected signing') !== -1) {
        throw new Error('User rejected signing')
      } else {
        throw error
      }
    }
  }

  const SignOut = async () => {
    removeLocalStorageWalletConnect()

    signOut()
  }

  return (
    <Web3Context.Provider
      value={{
        adminSignIn,

        SignOut,

        web3Error,
        session,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

const removeLocalStorageWalletConnect = () => {
  const walletConnectCache = localStorage.getItem('walletconnect')
  if (walletConnectCache) {
    localStorage.removeItem('walletconnect')
  }
  const walletMobileCache = localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')
  if (walletMobileCache) {
    localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
  }
}
