import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-truffle5'
import { config as dotEnvConfig } from 'dotenv'

dotEnvConfig()

const mnemonicPhrase = process.env.MNEMONIC || 'test test test test test test test test test test test junk'
const mnemonicPassword = process.env.MNEMONIC_PASSWORD
const providerUrl = process.env.PROVIDER_URL || 'http://localhost:8545'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 15000,
      },
    }
  },
  networks: {
    hardhat: {},
    localhost: {},
    testnet: {
      url: `${providerUrl}`,
      accounts: {
        mnemonic: mnemonicPhrase,
        path: 'm/44\'/60\'/0\'/0',
        initialIndex: 0,
        count: 1,
        passphrase: mnemonicPassword,
      }
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  mocha: {
    timeout: 0
  }
}

export default config
