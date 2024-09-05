import { task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import { Contract } from 'ethers'
import {
  getDeployStat,
  updateDeployStat,
  proxyContractAddress,
} from '../deploy/utils'
import { ContractName } from '../def/const'
import { collectDeployments } from '../deploy/execution/500_aggregate_all_contract'

interface Task {
  name: string
  txId: string
}

task('approve', 'Approve upgrade deployment')
  .addParam('name', 'The contract name')
  .addParam('txId', 'Tx ID of upgrade deployment')
  .setAction(async (_taskArgs, hre) => {
    const taskArgs = _taskArgs as Task

    if (hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
      const proxyAddress = proxyContractAddress(
        hre.network,
        taskArgs.name as ContractName,
      )
      if (proxyAddress) {
        const { deployments } = hre
        const proxyContract = await deployments.get(taskArgs.name)
        if (proxyAddress !== proxyContract.address) {
          return Promise.reject('Counter proxy address mismatch')
        }
      }
    }

    const multisigWallet = (await hre.ethers.getContract(
      ContractName.MULTISIG_WALLET_CONTRACT_NAME,
    )) as Contract
    if (!(await multisigWallet.executed(taskArgs.txId))) return

    const stat = await getDeployStat(hre, taskArgs.name as ContractName)
    if (!stat) {
      return Promise.reject('Invalid deployment state')
    }
    stat.Approved = true
    await updateDeployStat(hre, stat)

    await collectDeployments(hre)
  })
