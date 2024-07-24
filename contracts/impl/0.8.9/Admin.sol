// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.9;
import '../../interface/0.8.9/ICounter.sol';

contract Admin {
    address private COUNTER_CONTRACT_ADDRESS;

    function add () public {
        require(COUNTER_CONTRACT_ADDRESS != address(0), 'invalid address');
        ICounter Counter = ICounter(COUNTER_CONTRACT_ADDRESS);
        Counter.inc();
    }

    function setCounterAddress(address counterAddress) public {
        require(counterAddress != address(0), 'invalid address');
        COUNTER_CONTRACT_ADDRESS = counterAddress;
    }
    
    function getCounterAddress() public view returns(address) {
        return COUNTER_CONTRACT_ADDRESS;
    }
}