import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  // get admin deployment
  const admin = await deployments.get('Admin')

  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  const deployResult = await deploy('Counter', {
    from: deployer,
    args: [admin.address], // visit admin contract address
    log: true,
    proxy: {
      proxyContract: process.env.COUNTER_PROXY_ADDRESS ? `${process.env.COUNTER_PROXY_ADDRESS}` : undefined
    }
  })

  if (deployResult.newlyDeployed) {
    const admin = (await ethers.getContract('Admin')) as Contract
    // set counter address for admin
    await admin.setCounterAddress(deployResult.address)
  }
}

export default func
func.tags = ['Counter']
func.dependencies = ['Admin']
