import { Network } from 'hardhat/types'
import { ContractName } from './contract_name'

export const proxyContractAddress = (
  network: Network,
  contractName: ContractName,
) => {
  let proxyAddress = undefined
  switch (network.name) {
    case 'mainnet':
      proxyAddress =
        process.env[`MAINNET_${contractName.toUpperCase()}_PROXY_ADDRESS`]
    case 'holesky':
      proxyAddress =
        process.env[`HOLESKY_${contractName.toUpperCase()}_PROXY_ADDRESS`]
  }
  return proxyAddress && proxyAddress.length ? proxyAddress : undefined
}
