import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction, Deployment } from 'hardhat-deploy/types'
import { Contract } from 'ethers'
import {
  ContractName,
  isProxyContract,
  isInitializableContract,
} from '../../def/const'
import { getDeployStat } from '../utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre

  const _allDeployments = await deployments.all()
  const allDeployments = new Map<string, Deployment>(
    Object.entries(_allDeployments),
  )

  interface MyContract {
    ContractName: string
    Address: string
    Owner?: string
    shouldInitialized: boolean
    Initialized: boolean
    Implementation: string
  }

  const contracts = [] as Array<MyContract>

  for (let [key, value] of allDeployments) {
    let owner = undefined as unknown as string
    let implementation = undefined as unknown as string
    let initialized = false
    try {
      const contract = (await hre.ethers.getContract(key)) as Contract
      owner = await contract.owner()
      if (isInitializableContract(key as ContractName)) {
        initialized = await contract.initialized()
        implementation = await contract.getImplementation()
      }
    } catch (e) {
      if (isProxyContract(key as ContractName)) {
        console.log(key, e)
      }
    }
    const stat = await getDeployStat(hre, key as ContractName)
    contracts.push({
      ContractName: key,
      Address: stat?.Address || value.address,
      Owner: stat?.Owner || owner,
      shouldInitialized: isInitializableContract(key as ContractName),
      Initialized: initialized,
      Implementation: stat?.Implementation || implementation,
      Upgrade: stat?.Upgrade || false,
      Approved: stat?.Approved || false,
    } as MyContract)
  }
  console.log(contracts)
}

export default func
func.tags = ['Aggregate']
func.runAtTheEnd = true
