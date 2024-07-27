import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ContractName, proxyContractAddress } from '../utils'

// We don't actually deploy ProxyAdmin here. We just check if it's the original one we deployed.

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre

  const proxyAddress = proxyContractAddress(hre.network, ContractName.PROXY_ADMIN_CONTRACT_NAME)
  if (proxyAddress) {
    const proxyContract = await deployments.get(ContractName.PROXY_ADMIN_CONTRACT_NAME)
    if (proxyAddress !== proxyContract.address) {
      return Promise.reject('Proxy admin address mismatch')
    }
  }
}

export default func
func.tags = [ContractName.PROXY_ADMIN_CONTRACT_NAME]
