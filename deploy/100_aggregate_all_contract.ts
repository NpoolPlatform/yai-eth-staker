import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction, Deployment} from 'hardhat-deploy/types' 

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre 
    const _allDeployments = await deployments.all()
    const allDeployments = new Map<string, Deployment>(Object.entries(_allDeployments))

    interface MyContract {
      ContractName: string
      Address: string
    }

    const contracts = [] as Array<MyContract>
    allDeployments.forEach((value, key) => {
        contracts.push({ContractName: key, Address: value.address} as MyContract)
    })
    console.log(contracts)
}

export default func
func.tags = ['Aggregate'] 
func.runAtTheEnd = true
