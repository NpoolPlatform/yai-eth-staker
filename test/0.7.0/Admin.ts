import { Contract } from 'ethers'
import { expect } from '../chai-setup'
import { ethers, deployments, getUnnamedAccounts } from 'hardhat'

describe('Admin', () => {
    it ('Set counter address', async () => {
        await deployments.fixture(['Admin']) // deploy Admin contract first
        const users = await getUnnamedAccounts()

        const Admin = await ethers.getContract('Admin') as Contract // interact with deployed Admin contract

        await Admin.setCounterAddress(users[1])
        const address = await Admin.getCounterAddress()

        expect(address).to.equal(users[1])
    })
})
