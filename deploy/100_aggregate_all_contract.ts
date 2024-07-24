import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction, Deployment} from 'hardhat-deploy/types'; 

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre; 
    const _allDeployments = await deployments.all()
    const allDeployments = new Map<string, Deployment>(Object.entries(_allDeployments))
    console.log('all contract: ')
    allDeployments.forEach((value, key) => {
        console.log(`${key}: ${value.address}`);
      });
};

export default func;
func.tags = ['Aggregate']; 
func.runAtTheEnd = true;
