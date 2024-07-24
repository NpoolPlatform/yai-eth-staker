import { Contract } from 'ethers'
import { expect } from '../chai-setup'
import { ethers, deployments } from 'hardhat'

describe('Counter', () => {
    it ('Get admin address', async () => {
        await deployments.fixture(['Counter']) // deploy Counter contract first

        const Admin = await ethers.getContract('Admin') as Contract // get admin deployment
        const Counter = await ethers.getContract('Counter') as Contract // interact with deployed Counter contract

        expect(Counter.ADMIN_ADDRESS).to.equal(Admin.address)
    })
})
