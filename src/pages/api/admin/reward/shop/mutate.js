import { prisma } from 'context/PrismaContext'
import adminMiddleware from '@middlewares/adminMiddleware'
import { QuestStyle, QuestDuration, ItemType, ContractType, RedeemStatus } from '@prisma/client'

const handler = async (req, res) => {
  const { method } = req

  if (method !== "POST") {
    return res.status(200).json({
      message: `POST only`,
      isError: true,
    })
  }

  try {
    const {
      id,
      title,
      description,
      available,
      maxPerAccount,
      isEnabled,
      image,
      itemType,
      requirements,
      contractAddress,
      contractType,
      abi,
      multiplier,
      chain,
      network,
      tokenId
    } = req.body


    const existingShopItem = await prisma.ShopItem.findUnique({
      where: {
        id,
      },

      include: {
        requirements: true,
        shopItemRedeem: true
      }
    })

    if (itemType === ItemType.ONCHAIN && contractType !== ContractType.ERC1155) {
      const shops = await prisma.shopItem.findMany({
        where: {
          isEnabled: true
        }
      })

      const shopWithThisContractAddress = shops.filter(q => q.contractAddress === contractAddress)[0]
      if (shopWithThisContractAddress && shopWithThisContractAddress?.id !== id) {
        return res.status(200).json({ isError: true, message: `Contract ${contractAddress} linked to another shop item` })
      }
    }

    let createManyShopItemRedeemData = [], lengthToAdd = 0;
    if (existingShopItem) {
      if (existingShopItem.shopItemRedeem.length < parseInt(available)) {
        lengthToAdd = parseInt(available) - existingShopItem.shopItemRedeem.length;

        createManyShopItemRedeemData = new Array(lengthToAdd).fill({
          status: RedeemStatus.AVAILABLE,
        })
      }
    } else {

      console.log("lengthToAdd", parseInt(available))
      createManyShopItemRedeemData = new Array(parseInt(available)).fill({
        status: RedeemStatus.AVAILABLE,
      })
    }


    let createObj = {
      title,
      description,
      available: parseInt(available),
      maxPerAccount: parseInt(maxPerAccount),
      image,
      isEnabled,
      itemType,
      requirements: {
        createMany: {
          data: requirements.map(r => {
            r.relationId = parseInt(r.relationId)
            return r;
          }) || []
        }
      },

      contractAddress,
      contractType,
      abi,
      chain,
      network,
      multiplier: parseInt(multiplier),
      tokenId: parseInt(tokenId)
    };

    let updateObj = {
      title,
      description,
      available: parseInt(available),
      maxPerAccount: parseInt(maxPerAccount),
      image,
      isEnabled,
      itemType,
      requirements: {
        deleteMany: {
          requirementId: {
            in: existingShopItem?.requirements.map((r) => r.requirementId) //to delete all currently in database
          }
        },
        createMany: {
          data: requirements.map(r => {
            r.relationId = parseInt(r.relationId)
            delete r.shopItemId;
            return r;
          }) || []
        }
      },

      contractAddress,
      contractType,
      abi,
      chain,
      network,
      multiplier: parseInt(multiplier),
      tokenId: parseInt(tokenId)
    }
    if (createManyShopItemRedeemData.length > 0) {

      createObj.shopItemRedeem = {
        createMany: {
          data: createManyShopItemRedeemData
        }
      };
      updateObj.shopItemRedeem = {
        createMany: {
          data: createManyShopItemRedeemData
        }
      }
    }

    const updatedContract = await prisma.ShopItem.upsert({
      where: {
        id: id || -1,
      },
      create: createObj,
      update: updateObj
    })

    res.status(200).json(updatedContract)
  } catch (err) {
    console.log(err)
    res.status(200).json({ isError: true, message: err.message })
  }

}

export default adminMiddleware(handler)
