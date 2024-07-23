import { Contract } from 'ethers'
import { expect } from '../chai-setup'
import { ethers, deployments, getNamedAccounts, getUnnamedAccounts } from 'hardhat'

describe('Token', () => {
    it ('Deployment should assign the total supply of tokens to the owner', async () => {
        await deployments.fixture(['Token']) // deploy Token contract first

        const { deployer } = await getNamedAccounts()
        const tokenOwner = deployer

        const Token = await ethers.getContract('Token') as Contract // interact with deployed Token contract
        const ownerBalance = await Token.balanceOf(tokenOwner)
        const supply = await Token.totalSupply()

        expect(ownerBalance).to.equal(supply)
    })
    it ('Transfer token to other account', async () => {
        await deployments.fixture(['Token'])
        const { deployer } = await getNamedAccounts()
        const tokenOwner = deployer

        const TokenAsOwner = await ethers.getContract('Token', tokenOwner)  as Contract
        const users = await getUnnamedAccounts()
        await TokenAsOwner.transfer(users[0], 50)

        expect(await TokenAsOwner.balanceOf(users[0])).to.equal(50)
    })
})
