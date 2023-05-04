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
      network
    } = req.body


    const existingShopItem = await prisma.ShopItem.findUnique({
      where: {
        id,
      },
      // select: {
      //   available: true,
      //   contractAddress: true,
      //   contractType: true,
      //   requirements: {
      //     select: {
      //       requirementType: true,
      //       relationId: true,
      //       requirementId: true,
      //       conditional: true,
      //     }
      //   },
      // }
      include: {
        requirements: true,
        shopItemRedeem: true
      }
    })

    if (itemType === ItemType.ONCHAIN) {
      const shopWithThisContractAddress = await prisma.ShopItem.findUnique({
        where: {
          contractAddress
        }
      })
      if (shopWithThisContractAddress && shopWithThisContractAddress?.id !== id) {
        return res.status(200).json({ isError: true, message: `Contract ${contractAddress} linked to another shop item` })
      }
    }

    if (itemType === ItemType.OFFCHAIN) {

    }

    let createManyShopItemRedeemData = [], lengthToAdd = 0;
    if (existingShopItem) {
      if (existingShopItem.shopItemRedeem.length < parseInt(available)) {
        lengthToAdd = parseInt(available) - existingShopItem.shopItemRedeem.length;
        console.log("lengthToAdd", lengthToAdd)
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
      multiplier: parseInt(multiplier)
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
      multiplier: parseInt(multiplier)
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
    else {
      console.log("no chane")
    }

    let updatedContract = await prisma.ShopItem.upsert({
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
