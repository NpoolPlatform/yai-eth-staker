import { HardhatUserConfig, vars  } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-truffle5'
import { config as dotEnvConfig } from 'dotenv'
require("@typechain/hardhat");

dotEnvConfig()

const mnemonicPhrase = process.env.MNEMONIC || 'test test test test test test test test test test test junk'
const mnemonicPassword = process.env.MNEMONIC_PASSWORD
const providerUrl = process.env.PROVIDER_URL || 'http://localhost:8545'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 15000,
          },
        }
      },
        {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 15000,
          },
        }
      }
    ]

  },
  networks: {
    holesky: {
      url: "https://rpc.holesky.ethpandaops.io",
      accounts: [ vars.get("HOLESKY_PRIVATE_KEY")]
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${vars.get('ALCHEMY_API_KEY')}`,
      accounts: [vars.get("SEPOLIA_PRIVATE_KEY")]
    },
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
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6"
  },
  mocha: {
    timeout: 0
  }
}

export default config
