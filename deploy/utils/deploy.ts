import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { contractAddress, proxyContractAddress } from './contract_address'
import { ContractName } from '../../def/const'
import { setMultisigOwner } from '../../def/env'
import { proxyContractType } from './proxy_contract'
import { Contract } from 'ethers'
import { Deployment } from 'hardhat-deploy/types'

const deployOptions = async (
  hre: HardhatRuntimeEnvironment,
  contractName: ContractName,
  owner: string,
) => {
  const { getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  return {
    from: deployer,
    log: true,
    proxy: {
      owner: owner,
      proxyContract: proxyContractType,
      viaAdminContract: ContractName.PROXY_ADMIN_CONTRACT_NAME,
    },
    gasPrice: (Number(await hre.web3.eth.getGasPrice()) * 1.4).toFixed(0),
  }
}

export const freshDeployContract = async (
  hre: HardhatRuntimeEnvironment,
  contractName: ContractName,
  owner: string,
): Promise<{
  initialized: boolean
  address: string
  implementationAddress: string
}> => {
  const { deployments } = hre
  const { deploy } = deployments

  console.log(`Fresh deploy contract ${contractName} by ${owner}`)
  const deployResult = await deploy(
    contractName,
    await deployOptions(hre, contractName, owner),
  )

  const contract = (await hre.ethers.getContract(contractName)) as Contract
  const initialized = deployResult.newlyDeployed || !contract.initialized()
  if (initialized) {
    await contract.initialize(owner)
  }
  return Promise.resolve({
    initialized,
    address: deployResult.address,
    implementationAddress: deployResult.implementation as string,
  })
}

export const upgradeContract = async (
  hre: HardhatRuntimeEnvironment,
  contractName: ContractName,
  owner: string,
): Promise<{
  initialized: boolean
  address: string
  implementationAddress: string
}> => {
  const { deployments } = hre
  const { deterministic, getExtendedArtifact } = deployments

  // const multisigContract = (await hre.ethers.getContract(ContractName.MULTISIG_WALLET_CONTRACT_NAME)) as Contract
  const { address, implementationAddress } = await deterministic(
    contractName,
    await deployOptions(hre, contractName, owner),
  )
  const extendedArtifact = await getExtendedArtifact(contractName)
  console.log(`Fresh deploy contract ${contractName} by ${owner}`)
  console.log(address, implementationAddress, extendedArtifact)
  // TODO: get upgrade transaction raw bytes
  // TODO: call propose of multisig contract
  return Promise.resolve({
    initialized: true,
    address,
    implementationAddress: implementationAddress as string,
  })
}

export const deployContract = async (
  hre: HardhatRuntimeEnvironment,
  contractName: ContractName,
): Promise<{
  initialized: boolean
  address: string
  implementationAddress: string
}> => {
  const { deployments, getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()

  const proxyAddress = proxyContractAddress(hre.network, contractName)
  let proxyContract = undefined as unknown as Deployment
  try {
    proxyContract = await deployments.get(contractName)
  } catch {
    // DO NOTHING
  }
  if (proxyAddress !== proxyContract?.address) {
    throw Error(`${contractName} proxy address mismatch`)
  }

  let multisigWalletAddress = contractAddress(
    hre.network,
    ContractName.MULTISIG_WALLET_CONTRACT_NAME,
  )
  if (!multisigWalletAddress) {
    const multisigWalletContract = await deployments.get(
      ContractName.MULTISIG_WALLET_CONTRACT_NAME,
    )
    multisigWalletAddress = multisigWalletContract.address
  }

  const contractOwner = setMultisigOwner() ? multisigWalletAddress : deployer
  return Promise.resolve(
    proxyAddress
      ? await upgradeContract(hre, contractName, contractOwner)
      : await freshDeployContract(hre, contractName, contractOwner),
  )
}
