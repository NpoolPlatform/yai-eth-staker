import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {
  contractAddress,
  proxyContractAddress,
  proxyContractType,
} from '../utils'
import { ContractName } from '../../def/const/contract_name'
import { Contract } from 'ethers'
import { setMultisigOwner } from '../../def/env'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  const proxyAddress = proxyContractAddress(
    hre.network,
    ContractName.ADMIN_CONTRACT_NAME,
  )
  if (proxyAddress) {
    const proxyContract = await deployments.get(
      ContractName.ADMIN_CONTRACT_NAME,
    )
    if (proxyAddress !== proxyContract.address) {
      return Promise.reject('Admin proxy address mismatch')
    }
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

  const deployResult = await deploy(ContractName.ADMIN_CONTRACT_NAME, {
    from: deployer,
    log: true,
    proxy: {
      owner: contractOwner,
      proxyContract: proxyContractType,
      viaAdminContract: ContractName.PROXY_ADMIN_CONTRACT_NAME,
    },
    gasPrice: (Number(await hre.web3.eth.getGasPrice()) * 1.4).toFixed(0),
  })

  const admin = (await hre.ethers.getContract(
    ContractName.ADMIN_CONTRACT_NAME,
  )) as Contract
  if (deployResult.newlyDeployed || !admin.initialized()) {
    await admin.initialize(contractOwner)

    const slot = await hre.ethers.provider.getStorage(
      deployResult.address,
      '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
    )
    console.log('impl: ', hre.ethers.stripZerosLeft(slot))
  }
}

export default func
func.tags = [ContractName.ADMIN_CONTRACT_NAME]
func.dependencies = [ContractName.MULTISIG_WALLET_CONTRACT_NAME]
