import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  // get admin deployments
  const Admin = await deployments.get('Admin')

  const { deployer } = await getNamedAccounts()
  const deployResult = await deploy('Counter', {
    from: deployer,
    args: [Admin.address], // visit Admin Contract address
    log: true,
  })

  if (deployResult.newlyDeployed) {
    const Admin = (await ethers.getContract('Admin')) as Contract
    // set counter address for admin
    await Admin.setCounterAddress(deployResult.address)
  }
}
export default func
func.tags = ['Counter']
func.dependencies = ['Admin']
