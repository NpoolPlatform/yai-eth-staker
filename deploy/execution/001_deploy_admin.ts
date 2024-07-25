import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ContractName, proxyContractAddress } from '../utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  await deploy(ContractName.ADMIN_CONTRACT_NAME, {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: proxyContractAddress(
        hre.network,
        ContractName.ADMIN_CONTRACT_NAME,
      ),
    },
  })
}

export default func
func.tags = [ContractName.ADMIN_CONTRACT_NAME]
