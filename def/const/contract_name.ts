export enum ContractName {
  /// This may be different if we use own proxy implementation
  PROXY_ADMIN_CONTRACT_NAME = 'DefaultProxyAdmin',

  MULTISIG_WALLET_CONTRACT_NAME = 'MultisigWallet',

  ADMIN_CONTRACT_NAME = 'Admin',
  ADMIN_PROXY_CONTRACT_NAME = 'Admin_Proxy',

  COUNTER_CONTRACT_NAME = 'Counter',
  COUNTER_PROXY_CONTRACT_NAME = 'Counter_Proxy',
  COUNTER_IMPLEMENTATION_CONTRACT_NAME = 'Counter_Implementation',
}

export const isProxyContract = (contractName: ContractName) => {
  return !contractName.includes('_')
}

export const isInitializableContract = (contractName: ContractName) => {
  return isProxyContract(contractName) &&
    contractName !== ContractName.MULTISIG_WALLET_CONTRACT_NAME &&
    contractName !== ContractName.PROXY_ADMIN_CONTRACT_NAME
}
