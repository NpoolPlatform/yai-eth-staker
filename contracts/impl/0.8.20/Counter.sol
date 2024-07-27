// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.20;

contract Counter {
    uint256 public count;
    address private adminContractAddress;

    error PermissionDenied();
    error InvalidAddress();

    modifier onlyAdminContract() {
        if (msg.sender != adminContractAddress) {
            revert PermissionDenied();
        }
        _;
    }

    event CounterIncreased(address indexed account, uint256 count);

    constructor(address adminAddress) {
        if (adminAddress == address(0)) {
            revert InvalidAddress();
        }
        adminContractAddress = adminAddress;
    }

    // Only admin contract can call
    function inc() public onlyAdminContract {
        count += 4;
        emit CounterIncreased(msg.sender, count);
    }

    function sub() public onlyAdminContract {
        count -= 2;
        emit CounterIncreased(msg.sender, count);
    }

    function get() public view returns (uint256) {
        return count;
    }
}
