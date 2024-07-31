import { Network } from 'hardhat/types'
import { ContractName } from '../../def/const/contract_name'

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

export const contractAddress = (
  network: Network,
  contractName: ContractName,
) => {
  let contractAddress = undefined
  const _contractName = contractName
    .split(/(?=[A-Z])/)
    .join('_')
    .toUpperCase()
  switch (network.name) {
    case 'mainnet':
      contractAddress = process.env[`MAINNET_${_contractName}_CONTRACT_ADDRESS`]
    case 'holesky':
      contractAddress = process.env[`HOLESKY_${_contractName}_CONTRACT_ADDRESS`]
  }
  return contractAddress && contractAddress.length ? contractAddress : undefined
}
