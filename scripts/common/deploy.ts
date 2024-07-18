import hre from 'hardhat'
import Web3 from 'web3'

export const deployMe = async () => {
  const network = hre.network
  let $web3 = new Web3(network.provider)

  let accounts = await $web3.eth.getAccounts()

  console.log(`Using network: ${network.name}`)
  console.log(`Deploying from: ${accounts[0]}`)
  console.log('\n')
}
