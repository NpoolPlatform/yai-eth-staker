// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.9;
import { ICounter } from '../../interface/0.8.9/ICounter.sol';

contract Admin {
    address private counterContractAddress;

    error InvalidAddress();

    function add() public {
        if (counterContractAddress == address(0)) {
            revert InvalidAddress();
        }
        ICounter(counterContractAddress).inc();
    }

    function setCounterAddress(address counterAddress) public {
        if (counterAddress == address(0)) {
            revert InvalidAddress();
        }
        counterContractAddress = counterAddress;
    }

    function getCounterAddress() public view returns (address) {
        return counterContractAddress;
    }
}
