import * as hardhat from 'hardhat'

export const deployMe = async () => {
    const network = hardhat.network
    console.log(`Using network: ${network.name}`)
}
