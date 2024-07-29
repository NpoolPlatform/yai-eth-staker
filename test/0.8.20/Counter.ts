import { Contract } from 'ethers'
import { expect } from '../chai-setup'
import { ethers, deployments } from 'hardhat'
import { ContractName } from '../../def/const/contract_name'

describe(ContractName.COUNTER_CONTRACT_NAME, () => {
  it('Get admin address', async () => {
    await deployments.fixture([ContractName.COUNTER_CONTRACT_NAME])

    const admin = (await ethers.getContract(ContractName.ADMIN_CONTRACT_NAME)) as Contract
    const counter = (await ethers.getContract(ContractName.COUNTER_CONTRACT_NAME)) as Contract

    expect(counter.ADMIN_ADDRESS).to.equal(admin.address)
  })
  it('Call directly', async () => {
    await deployments.fixture([ContractName.COUNTER_CONTRACT_NAME])

    const counter = (await ethers.getContract(ContractName.COUNTER_CONTRACT_NAME)) as Contract

    await expect(counter.inc()).to.revertedWith('PermissionDenied') // call directly with counter will report err
  })
})
