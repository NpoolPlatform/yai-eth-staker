// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract Counter is Initializable {
    uint256 public count;
    address private s_adminContractAddress;

    error PermissionDenied();
    error InvalidAddress();

    modifier onlyAdminContract() {
        if (msg.sender != s_adminContractAddress) revert PermissionDenied();
        _;
    }

    event CounterIncreased(address indexed account, uint256 count);

    function initialize(address adminAddress) public initializer {
        if (adminAddress == address(0)) revert InvalidAddress();
        s_adminContractAddress = adminAddress;
    }

    // Only admin contract can call
    function inc() public onlyAdminContract {
        count += 1;
        emit CounterIncreased(msg.sender, count);
    }

    function sub() public onlyAdminContract {
        count -= 1;
        emit CounterIncreased(msg.sender, count);
    }

    function get() public view returns (uint256) {
        return count;
    }
}
