import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { Contract } from 'ethers'
import { ContractName, proxyContractAddress, proxyContractType } from '../utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  // get admin deployment
  const admin = await deployments.get(ContractName.ADMIN_CONTRACT_NAME)

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

  const deployResult = await deploy(ContractName.COUNTER_CONTRACT_NAME, {
    from: deployer,
    args: [admin.address], // visit admin contract address
    log: true,
    proxy: {
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
  }
}

export default func
func.tags = [ContractName.COUNTER_CONTRACT_NAME]
func.dependencies = [ContractName.ADMIN_CONTRACT_NAME]
