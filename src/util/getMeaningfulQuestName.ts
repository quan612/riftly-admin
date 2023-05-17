import Enums from "@enums/index"
import { Quest } from "@models/quest"

const getMeaningfulQuestName = (quest: Quest) => {
  const { text, type, extendedQuestData } = quest

  switch (type?.name) {
    case Enums.DISCORD_AUTH:
    case Enums.TWITTER_AUTH:
    case Enums.WALLET_AUTH:
      return text
    case Enums.JOIN_DISCORD:
      return `Join Discord server ${extendedQuestData.discordServer}`
    case Enums.TWITTER_RETWEET:
      return `Retweet tweet ${extendedQuestData.tweetId}`
    case Enums.FOLLOW_TWITTER:
      return `Follow twitter ${extendedQuestData.followAccount}`
    case Enums.FOLLOW_INSTAGRAM:
      return `Follow instagram ${extendedQuestData.followAccount}`
    case Enums.OWNING_NFT_CLAIM:
      return `Own an NFT ${extendedQuestData.nft}`
    case Enums.CODE_QUEST:
      return `Finished code quest event ${extendedQuestData.codeEvent}`
    default:
      return type?.name ?? text
  }
}

export default getMeaningfulQuestName