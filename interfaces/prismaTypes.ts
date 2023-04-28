// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT


export enum AccountStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
}

export enum VerificationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
}

export enum QuestStyle {
    NORMAL = 'NORMAL',
    FEATURED = 'FEATURED',
}

export enum QuestDuration {
    ONGOING = 'ONGOING',
    LIMITED = 'LIMITED',
}

export enum ItemType {
    OFFCHAIN = 'OFFCHAIN',
    ONCHAIN = 'ONCHAIN',
}

export enum ContractType {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
}

export enum RedeemStatus {
    AVAILABLE = 'AVAILABLE',
    PENDING = 'PENDING',
    REDEEMED = 'REDEEMED',
}


export interface WhiteList {
    id: number,
    wallet?: string,
    twitterId?: string,
    twitterUserName?: string,
    userId: string,
    discordId?: string,
    discordUserDiscriminator?: string,
    createdAt: Date,
    updatedAt: Date,
    pendingRewards: PendingReward[],
    rewards: Reward[],
    userQuest: UserQuest[],
    nonce?: string,
    whiteListUserData?: WhiteListUserData,
    uathUser?: string,
    email?: string,
    password?: string,
    avatar?: string,
    status?: AccountStatus,
    signUpOrigin?: string,
    shopItemRedeem: ShopItemRedeem[],
}

export interface WhiteListUserData {
    id: number,
    userId: string,
    user: WhiteList,
    eth?: number,
    lastEthUpdated?: Date,
    followers?: number,
    lastFollowersUpdated?: Date,
}

export interface PendingReward {
    id: number,
    generatedURL: string,
    isClaimed: boolean,
    rewardTypeId: number,
    quantity: number,
    createdAt: Date,
    rewardType: RewardType,
    user?: WhiteList,
    userId?: string,
}

export interface Reward {
    id: number,
    rewardTypeId: number,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    rewardType: RewardType,
    user?: WhiteList,
    userId?: string,
}

export interface RewardType {
    id: number,
    reward: string,
    pendingRewards: PendingReward[],
    quests: Quest[],
    rewards: Reward[],
    userQuests: UserQuest[],
    rewardPreview?: string,
    rewardIcon?: string,
    isEnabled: boolean,
}

export interface QuestType {
    id: number,
    name: string,
    description?: string,
    quests: Quest[],
}

export interface UserQuest {
    id: number,
    questId: string,
    extendedUserQuestData?: any,
    createdAt: Date,
    rewardedQty?: number,
    rewardedTypeId?: number,
    quest: Quest,
    rewardType?: RewardType,
    updatedAt: Date,
    isHidden: boolean,
    hasClaimed: boolean,
    isClaimable: boolean,
    user: WhiteList,
    userId: string,
}

export interface Quest {
    id: number,
    type: QuestType,
    text: string,
    completedText: string,
    rewardTypeId: number,
    quantity: number,
    isEnabled: boolean,
    isRequired: boolean,
    isDeleted: boolean,
    description?: string,
    extendedQuestData?: any,
    questId: string,
    createdAt: Date,
    updatedAt: Date,
    rewardType: RewardType,
    userQuests: UserQuest[],
    questTypeId: number,
    style: QuestStyle,
    duration: QuestDuration,
    image?: string,
}

export interface Admin {
    id: number,
    wallet: string,
    username?: string,
    nonce?: string,
}

export interface LogError {
    id: number,
    url: string,
    referer?: string,
    userAgent?: string,
    content?: any,
    createdAt: Date,
}

export interface logRegister {
    id: number,
    url: string,
    referer?: string,
    userAgent?: string,
    wallet?: string,
    ip?: string,
    createdAt: Date,
}

export interface QuestVariables {
    id: number,
    vercel_env: string,
    discordId: string,
    discordSecret: string,
    discordBackend: string,
    discordBackendSecret: string,
    twitterId: string,
    twitterSecret: string,
    twitterBearerToken?: string,
    pendingRewardImageUrl?: string,
    discordBotToken?: string,
    hostUrl?: string,
    googleClientEmail?: string,
    googleClientId?: string,
    googleProjectId?: string,
    googlePropertyId?: string,
    smsSid?: string,
    smsAuthToken?: string,
    smsServiceId?: string,
    requiredSmsVerification: boolean,
    apiKey?: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface Discord {
    id: number,
    channelId: string,
    channel?: string,
    isEnabled: boolean,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface WebPushSubscription {
    id: number,
    endpoint?: string,
    auth?: string,
    p256dh?: string,
}

export interface AdminLogError {
    id: number,
    route?: string,
    message?: string,
    isSeen: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface ConfigImageHosting {
    id: number,
    cloudinaryName?: string,
    cloudinaryKey?: string,
    cloudinarySecret?: string,
    generalPreset?: string,
    avatarPreset?: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface ConfigRedeemableContract {
    id: number,
    contract: string,
    maxRedeemable: number,
    totalRedeemable: number,
    text: string,
    description: string,
    image?: string,
    nftType?: string,
    isEnabled: boolean,
    requirements: RedeemRequirement[],
    contractAbi?: any,
}

export interface RedeemRequirement {
    id: number,
    requirementId: string,
    kind: string,
    relationId: number,
    conditional?: any,
    redeem?: ConfigRedeemableContract,
    redeemId?: number,
}

export interface NftContractData {
    id: number,
    name: string,
    address: string,
    chain: string,
    data?: any,
    updatedAt: Date,
}

export interface ShopItem {
    id: number,
    title: string,
    description: string,
    image?: string,
    available: number,
    maxPerAccount: number,
    multiplier: number,
    isEnabled: boolean,
    requirements: ShopItemRequirement[],
    itemType: ItemType,
    shopItemRedeem: ShopItemRedeem[],
    contractAddress?: string,
    contractType?: ContractType,
    abi?: any,
}

export interface ShopItemRequirement {
    id: number,
    requirementId: string,
    requirementType: string,
    relationId: number,
    conditional?: any,
    shopItem?: ShopItem,
    shopItemId?: number,
}

export interface ShopItemRedeem {
    id: number,
    shopItem: ShopItem,
    shopItemId: number,
    redeemedBy?: WhiteList,
    userId?: string,
    status: RedeemStatus,
    extendedRedeemData?: any,
    createdAt: Date,
    updatedAt: Date,
}
