// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.9;

contract Counter {
    uint256 public count;
    address private ADMIN_ADDRESS;

    error PermissionDenied();
    error InvalidAddress();

    modifier onlyAdminContract() {
        if (msg.sender != ADMIN_ADDRESS) {
            revert PermissionDenied();
        }
        _;
    }

    event CounterIncreased(address indexed account, uint256 count);

    constructor(address adminAddress) {
        if (adminAddress == address(0)) {
            revert InvalidAddress();
        }
        ADMIN_ADDRESS = adminAddress;
    }

    // Only admin contract can call
    function inc() public onlyAdminContract {
        count += 1;
        emit CounterIncreased(msg.sender, count);
    }

    function get() public view returns (uint256) {
        return count;
    }
}
