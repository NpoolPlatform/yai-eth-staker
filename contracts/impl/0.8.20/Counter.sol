// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.20;

import { Initializable } from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

contract Counter is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public count;
    address private s_adminContractAddress;

    error PermissionDenied();
    error InvalidAddress();

    modifier onlyAdminContract() {
        if (msg.sender != s_adminContractAddress) revert PermissionDenied();
        _;
    }

    event CounterIncreased(address indexed account, uint256 count);
    event CounterInitialized(address initialOwner);
    event CounterAdminAddressSet(address adminAddress);
    event CounterUpgraded(address newImplementation);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(initialOwner);
        emit CounterInitialized(initialOwner);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {
        emit CounterUpgraded(newImplementation);
    }

    function initialized() public view returns (bool) {
        return _getInitializedVersion() > 0;
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
        count -= 1;
        emit CounterIncreased(msg.sender, count);
    }

    function get() public view returns (uint256) {
        return count;
    }

    function getAdminAddress() public view returns (address) {
        return s_adminContractAddress;
    }
}
