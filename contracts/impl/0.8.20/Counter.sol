// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

import { CMInitializableUpgradeable } from '../base/CMInitializableUpgradeable.sol';

contract Counter is CMInitializableUpgradeable {
    uint256 public count;
    address private s_adminContractAddress;

    error PermissionDenied();
    error InvalidAddress();

    modifier onlyAdminContract() {
        if (msg.sender != s_adminContractAddress) revert PermissionDenied();
        _;
    }

    event CounterIncreased(address indexed account, uint256 count);
    event CounterAdminAddressSet(address adminAddress);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function setAdminAddress(address adminAddress) public onlyProxy {
        if (adminAddress == address(0)) revert InvalidAddress();
        s_adminContractAddress = adminAddress;
    }

    // Only admin contract can call
    function inc() public onlyAdminContract {
        count += 1;
        emit CounterIncreased(msg.sender, count);
    }

    function sub() public onlyAdminContract {
        count -= 2;
        emit CounterIncreased(msg.sender, count);
    }

    function get() public view returns (uint256) {
        return count;
    }

    function getAdminAddress() public view returns (address) {
        return s_adminContractAddress;
    }
}
