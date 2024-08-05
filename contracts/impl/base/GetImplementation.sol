// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;
import { ERC1967Utils } from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol';

// All upgradable contract need to inherit this contract
contract GetImplementation {
    // In the child contract, this function can be overrided using the `override` keyword
    function getImplementation() public view virtual returns (address) {
        return ERC1967Utils.getImplementation();
    }
}
