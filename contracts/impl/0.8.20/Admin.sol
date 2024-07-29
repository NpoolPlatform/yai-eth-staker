// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.20;

import { ICounter } from '../../interface/ICounter.sol';

contract Admin {
    address private s_counterContractAddress;

    error InvalidAddress();

    function add() public {
        if (s_counterContractAddress == address(0)) revert InvalidAddress();
        ICounter(s_counterContractAddress).inc();
    }

    function add2() public {
        if (s_counterContractAddress == address(0)) revert InvalidAddress();
        ICounter(s_counterContractAddress).inc();
        ICounter(s_counterContractAddress).inc();
    }

    function setCounterAddress(address counterAddress) public {
        if (counterAddress == address(0)) revert InvalidAddress();
        s_counterContractAddress = counterAddress;
    }

    function getCounterAddress() public view returns (address) {
        return s_counterContractAddress;
    }
}
