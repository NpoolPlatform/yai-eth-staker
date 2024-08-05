// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

import { CMInitializableUpgradeable } from '../base/CMInitializableUpgradeable.sol';

import { ICounter } from '../../interface/ICounter.sol';

contract TreasureCenter is CMInitializableUpgradeable {
    address private s_counterContractAddress;

    error InvalidAddress();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function add() public {
        if (s_counterContractAddress == address(0)) revert InvalidAddress();
        ICounter(s_counterContractAddress).inc();
    }

    function add2() public {
        if (s_counterContractAddress == address(0)) revert InvalidAddress();
        ICounter(s_counterContractAddress).inc();
        ICounter(s_counterContractAddress).inc();
    }

    function setCounterAddress(address counterAddress) public onlyProxy {
        if (counterAddress == address(0)) revert InvalidAddress();
        s_counterContractAddress = counterAddress;
    }

    function getCounterAddress() public view returns (address) {
        return s_counterContractAddress;
    }
}
