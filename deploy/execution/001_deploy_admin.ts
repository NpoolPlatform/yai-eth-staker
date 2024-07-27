import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ContractName, proxyContractAddress } from '../utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  const proxyAddress = proxyContractAddress(hre.network, ContractName.ADMIN_CONTRACT_NAME)
  if (proxyAddress) {
    const proxyContract = await deployments.get(ContractName.ADMIN_CONTRACT_NAME)
    if (proxyAddress !== proxyContract.address) {
      return Promise.reject('Admin proxy address mismatch')
    }
  }

  await deploy(ContractName.ADMIN_CONTRACT_NAME, {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: 'OpenZeppelinTransparentProxy',
    },
  })
}

export default func
func.tags = [ContractName.ADMIN_CONTRACT_NAME]
