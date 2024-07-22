import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const defaultCount = 100;

const CounterModule = buildModule('CounterModule', (m) => {
  const count = m.getParameter('count', defaultCount);

  const counter = m.contract('Counter', [count]);
  return { counter };
  // communicate with exist contract ->  https://hardhat.org/ignition/docs/guides/creating-modules#using-an-existing-contract
  // deploy multi contracts in order at single file -> https://hardhat.org/ignition/docs/guides/creating-modules#dependencies-between--future--objects
  // visit other module -> https://hardhat.org/ignition/docs/guides/creating-modules#creating-a-module-hierarchy-using-submodules
  // Deploying and calling contracts from different accounts -> https://hardhat.org/ignition/docs/guides/creating-modules#deploying-and-calling-contracts-from-different-accounts

});

export default CounterModule;
