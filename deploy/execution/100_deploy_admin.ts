import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ContractName } from '../../def/const/contract_name'
import { deployContract } from '../utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  await deployContract(hre, ContractName.ADMIN_CONTRACT_NAME)
}

export default func
func.tags = [ContractName.ADMIN_CONTRACT_NAME]
func.dependencies = [ContractName.MULTISIG_WALLET_CONTRACT_NAME]
