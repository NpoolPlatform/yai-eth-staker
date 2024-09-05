import { task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import { Contract } from 'ethers'
import { proxyContractAddress } from '../deploy/utils'
import { ContractName } from '../def/const'

interface Task {
  name: string
  method: string
  args: string
  signer: string
}

task('invoke', 'Invoke deployed contract function')
  .addParam('name', 'The contract name')
  .addParam('method', 'The contract method to call')
  .addOptionalParam(
    'args',
    'The arguments for the contract method as a JSON string',
    '[]',
  )
  .addOptionalParam(
    'signer',
    'The account name that initiated the transaction(config in hardhat.config.ts)',
    'deployer',
  )
  .setAction(async (_taskArgs, hre) => {
    const taskArgs = _taskArgs as Task

    if (hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
      const proxyAddress = proxyContractAddress(
        hre.network,
        taskArgs.name as ContractName,
      )
      const { deployments } = hre
      if (proxyAddress) {
        const proxyContract = await deployments.get(taskArgs.name)
        if (proxyAddress !== proxyContract.address) {
          return Promise.reject('Counter proxy address mismatch')
        }
      }
    }

    const signer = await hre.ethers.getNamedSigner(taskArgs.signer)
    const contract = (await hre.ethers.getContract(
      taskArgs.name,
      signer,
    )) as Contract
    if (typeof contract[taskArgs.method] !== 'function') {
      console.error(
        `Method ${taskArgs.method} does not exist on contract ${taskArgs.name}`,
      )
      return
    }

    const methodArgs = JSON.parse(taskArgs.args)
    console.log('\n\n')
    try {
      const result = await contract[taskArgs.method](...methodArgs)
      console.log(
        '\u001b[1;32m',
        taskArgs.name,
        taskArgs.method,
        methodArgs,
        ': ',
        '\x1b[0m',
        '\u001b[1;34m',
        result,
        '\x1b[0m',
      )
    } catch (error) {
      console.log(
        '\u001b[1;31m',
        taskArgs.name,
        taskArgs.method,
        methodArgs,
        ': ',
        error,
        '\x1b[0m',
      )
      // @ts-ignore
      const revertData = error?.data?.data
      const decodedError = contract.interface.parseError(revertData)
      console.log(`Transaction failed: ${decodedError?.name}`)
    }
    console.log('\n\n')
  })
