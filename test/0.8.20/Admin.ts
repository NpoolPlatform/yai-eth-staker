import { Contract } from 'ethers'
import { expect } from '../chai-setup'
import { ethers, deployments, getUnnamedAccounts } from 'hardhat'
import { ContractName } from '../../def/const/contract_name'

describe(ContractName.ADMIN_CONTRACT_NAME, () => {
  it('Initialized', async () => {
    await deployments.fixture([ContractName.ADMIN_CONTRACT_NAME])
    const admin = (await ethers.getContract(
      ContractName.ADMIN_CONTRACT_NAME,
    )) as Contract

    const initialized = await admin.initialized()
    expect(initialized).to.equal(true)

    await expect(admin.initialize(admin.getAddress())).to.revertedWith(
      'InvalidInitialization',
    )
  })

  it('Set counter address', async () => {
    await deployments.fixture([ContractName.ADMIN_CONTRACT_NAME])
    const users = await getUnnamedAccounts()

    const admin = (await ethers.getContract(
      ContractName.ADMIN_CONTRACT_NAME,
    )) as Contract

    await admin.setCounterAddress(users[1])
    const address = await admin.getCounterAddress()

    expect(address).to.equal(users[1])
  })

  it('Add count', async () => {
    await deployments.fixture([ContractName.ADMIN_CONTRACT_NAME])
    const admin = (await ethers.getContract(
      ContractName.ADMIN_CONTRACT_NAME,
    )) as Contract

    await deployments.fixture([ContractName.COUNTER_CONTRACT_NAME])
    const counter = (await ethers.getContract(
      ContractName.COUNTER_CONTRACT_NAME,
    )) as Contract
    const counterImpl = (await ethers.getContract(
      ContractName.COUNTER_IMPLEMENTATION_CONTRACT_NAME,
    )) as Contract

    await admin.setCounterAddress(counter.getAddress())
    await counter.setAdminAddress(admin.getAddress())

    await expect(
      counterImpl.setAdminAddress(admin.getAddress()),
    ).to.revertedWith('UUPSUnauthorizedCallContext')

    await admin.add()
    expect(await counter.get()).to.equal(1)

    await admin.add()
    expect(await counter.get()).to.equal(2)
  })
})
