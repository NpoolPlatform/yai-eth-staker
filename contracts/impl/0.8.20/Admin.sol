// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.20;

import { ICounter } from '../../interface/ICounter.sol';

contract Admin {
    address private counterContractAddress;

    error InvalidAddress();

    function add() public {
        if (counterContractAddress == address(0)) {
            revert InvalidAddress();
        }
        ICounter(counterContractAddress).inc();
    }

    function add2() public {
        if (counterContractAddress == address(0)) {
            revert InvalidAddress();
        }
        ICounter(counterContractAddress).inc();
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
