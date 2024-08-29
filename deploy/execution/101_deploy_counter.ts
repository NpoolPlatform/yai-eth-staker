import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { Contract } from 'ethers'
import { deployContract } from '../utils'
import { ContractName } from '../../def/const/contract_name'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { initialized, address } = await deployContract(
    hre,
    ContractName.COUNTER_CONTRACT_NAME,
  )

  const counter = (await hre.ethers.getContract(
    ContractName.COUNTER_CONTRACT_NAME,
  )) as Contract
  if (!initialized || !(await counter.initialized())) {
    const admin = (await hre.ethers.getContract(
      ContractName.ADMIN_CONTRACT_NAME,
    )) as Contract
    // Here we cannot invoke onlyOwner function due to the owner is not initialized
    await admin.setCounterAddress(address)
    await counter.setAdminAddress(admin.getAddress())
  }
}

export default func
func.tags = [ContractName.COUNTER_CONTRACT_NAME]
func.dependencies = [
  ContractName.MULTISIG_WALLET_CONTRACT_NAME,
  ContractName.ADMIN_CONTRACT_NAME,
]
