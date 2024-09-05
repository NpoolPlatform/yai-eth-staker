import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { collectDeployments } from '../utils/collect'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  await collectDeployments(hre)
}

export default func
func.tags = ['Aggregate']
func.runAtTheEnd = true
