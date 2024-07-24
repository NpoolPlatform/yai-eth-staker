import { Contract } from 'ethers'
import { expect } from '../chai-setup'
import { ethers, deployments } from 'hardhat'

describe('Counter', () => {
  it('Get admin address', async () => {
    await deployments.fixture(['Counter']) // deploy counter contract first (it also deploy admin contract first)

    const admin = (await ethers.getContract('Admin')) as Contract // interact with deployed admin contract
    const counter = (await ethers.getContract('Counter')) as Contract // interact with deployed Counter contract

    expect(counter.ADMIN_ADDRESS).to.equal(admin.address)
  })
  it('Add count', async () => {
    await deployments.fixture(['Counter'])

    const admin = (await ethers.getContract('Admin')) as Contract
    const counter = (await ethers.getContract('Counter')) as Contract

    await admin.add() // increase count
    expect(await counter.get()).to.equal(1)

    await admin.add() // increase count
    expect(await counter.get()).to.equal(2)
  })
  it('Call directly', async () => {
    await deployments.fixture(['Counter'])

    const counter = (await ethers.getContract('Counter')) as Contract

    await expect(counter.inc()).to.revertedWith('PermissionDenied') // call directly with counter will report err
  })
})
