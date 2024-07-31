import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ContractName } from '../../def/const/contract_name'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  await deploy(ContractName.MULTISIG_WALLET_CONTRACT_NAME, {
    from: deployer,
    log: true,
    args: [[deployer], 1],
    proxy: false
  })
}

export default func
func.tags = [ContractName.MULTISIG_WALLET_CONTRACT_NAME]
