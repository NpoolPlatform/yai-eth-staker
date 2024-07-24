// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.9;
import { ICounter } from '../../interface/0.8.9/ICounter.sol';

contract Admin {
    address private COUNTER_CONTRACT_ADDRESS;

    error InvalidAddress();

    function add() public {
        if (COUNTER_CONTRACT_ADDRESS == address(0)) {
            revert InvalidAddress();
        }
        ICounter Counter = ICounter(COUNTER_CONTRACT_ADDRESS);
        Counter.inc();
    }

    function setCounterAddress(address counterAddress) public {
        if (counterAddress == address(0)) {
            revert InvalidAddress();
        }
        COUNTER_CONTRACT_ADDRESS = counterAddress;
    }

    function getCounterAddress() public view returns (address) {
        return COUNTER_CONTRACT_ADDRESS;
    }
}
