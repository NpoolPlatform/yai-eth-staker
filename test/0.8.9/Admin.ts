import { Contract } from 'ethers'
import { expect } from '../chai-setup'
import { ethers, deployments, getUnnamedAccounts } from 'hardhat'

describe('Admin', () => {
  it('set counter address', async () => {
    await deployments.fixture(['Admin']) // deploy admin contract first
    const users = await getUnnamedAccounts()

    const admin = (await ethers.getContract('Admin')) as Contract // interact with deployed admin contract

    await admin.setCounterAddress(users[1])
    const address = await admin.getCounterAddress()

    expect(address).to.equal(users[1])
  })
})
