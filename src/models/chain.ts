

export const enum Chain  {
  Ethereum="Ethereum",
  Polygon="Polygon",
  Arbitrum="Arbitrum",
  Avalance="Avalance"
}

export const enum Network  {
  EthereumMainnet="Ethereum Mainnet",
  EthereumGoerli="Ethereum Goerli",

  PolygonMainnet="Polygon Mainnet",
  PolygonMumbai="Polygon Mumbai",

  ArbitrumMainnet="Arbitrum Mainnet",
  ArbitrumGoerli="Arbitrum Goerli",

  AvalanceMainnet="Avalance Mainnet", // 43114
  AvalanceFuji="Avalance Fuji", // 43113
}


export const chainTypes = [
  {
    id: 1,
    name: Chain.Ethereum,
    value: Chain.Ethereum,
  },
  {
    id: 2,
    name: Chain.Polygon,
    value: Chain.Polygon,
  },
  {
    id: 3,
    name: Chain.Arbitrum,
    value: Chain.Arbitrum,
  },
  {
    id: 4,
    name: Chain.Avalance,
    value: Chain.Avalance,
  },
]