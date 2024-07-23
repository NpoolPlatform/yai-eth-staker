export enum MainnetNetwork {
    Mainnet = 'mainnet',
}

export enum TestnetNetwork {
    Hardhat = 'hardhat',
    Sepolia = 'sepolia',
    Holesky = 'holesky'
}

export const DeploymentNetwork = {
    ...MainnetNetwork,
    ...TestnetNetwork
};