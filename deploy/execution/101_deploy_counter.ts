import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { Contract } from 'ethers'
import { proxyContractAddress, contractAddress, proxyContractType } from '../utils'
import { ContractName } from '../../def/const/contract_name'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  const proxyAddress = proxyContractAddress(
    hre.network,
    ContractName.COUNTER_CONTRACT_NAME,
  )
  if (proxyAddress) {
    const proxyContract = await deployments.get(
      ContractName.COUNTER_CONTRACT_NAME,
    )
    if (proxyAddress !== proxyContract.address) {
      return Promise.reject('Counter proxy address mismatch')
    }
  }

  let multisigWalletAddress = contractAddress(hre.network, ContractName.MULTISIG_WALLET_CONTRACT_NAME)
  if (!multisigWalletAddress) {
    const multisigWalletContract = await deployments.get(ContractName.MULTISIG_WALLET_CONTRACT_NAME)
    multisigWalletAddress = multisigWalletContract.address
  }


  const deployResult = await deploy(ContractName.COUNTER_CONTRACT_NAME, {
    from: deployer,
    log: true,
    proxy: {
      owner: multisigWalletAddress,
      proxyContract: proxyContractType,
      viaAdminContract: ContractName.PROXY_ADMIN_CONTRACT_NAME,
    },
  })

  if (deployResult.newlyDeployed) {
    const admin = (await hre.ethers.getContract(
      ContractName.ADMIN_CONTRACT_NAME,
    )) as Contract
    // set counter address for admin
    await admin.setCounterAddress(deployResult.address)
    const counter = (await hre.ethers.getContract(
      ContractName.COUNTER_CONTRACT_NAME,
    )) as Contract
    await counter.setAdminAddress(admin.getAddress())
  }
}

export default func
func.tags = [ContractName.COUNTER_CONTRACT_NAME]
func.dependencies = [ContractName.ADMIN_CONTRACT_NAME]
