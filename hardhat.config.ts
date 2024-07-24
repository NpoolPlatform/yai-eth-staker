import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-truffle5'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import '@nomicfoundation/hardhat-verify'
import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

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
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
      mainnet: '0x8FC831e238F7AF962214a866BE36fC1429774d60',
      holesky: '0x8FC831e238F7AF962214a866BE36fC1429774d60',
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      accounts: {
        count: 10,
        accountsBalance: '1000000000000000000000',
      },
      live: false,
      allowUnlimitedContractSize: true,
      saveDeployments: true,
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      live: true,
      accounts: [process.env.MAINNET_PRIVATE_KEY!].filter(Boolean),
      saveDeployments: true,
      //deploy: [`deploy/scripts/${DeploymentNetwork.Mainnet}`], // can specify different deployment paths for different networks, default is deploy directory
      verify: {
        // verifying the source code of smart contract on Etherscan if needed
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
        },
      },
      // tags: ['contract1', 'contract2'] // only deploy contract contains these tag
    },
    holesky: {
      url: 'https://ethereum-holesky.publicnode.com',
      accounts: [process.env.HOLESKY_PRIVATE_KEY!].filter(Boolean),
      saveDeployments: true,
      live: false,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './output/cache',
    artifacts: './output/artifacts',
    deploy: './deploy',
  },
  typechain: {
    outDir: 'output/typechain-types',
    target: 'ethers-v6',
  },
  mocha: {
    timeout: 0,
  },
}

export default config
