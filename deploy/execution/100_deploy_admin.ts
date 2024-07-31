import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { contractAddress, proxyContractAddress, proxyContractType } from '../utils'
import { ContractName } from '../../def/const/contract_name'

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

  let multisigWalletAddress = contractAddress(hre.network, ContractName.MULTISIG_WALLET_CONTRACT_NAME)
  if (!multisigWalletAddress) {
    const multisigWalletContract = await deployments.get(ContractName.MULTISIG_WALLET_CONTRACT_NAME)
    multisigWalletAddress = multisigWalletContract.address
  }

  await deploy(ContractName.ADMIN_CONTRACT_NAME, {
    from: deployer,
    log: true,
    proxy: {
      owner: multisigWalletAddress,
      proxyContract: proxyContractType,
      viaAdminContract: ContractName.PROXY_ADMIN_CONTRACT_NAME,
    },
  })
}

export default func
func.tags = [ContractName.ADMIN_CONTRACT_NAME]
