// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.20;

import { Initializable } from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import { ICounter } from '../../interface/ICounter.sol';

contract Admin is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    address private s_counterContractAddress;

    error InvalidAddress();

    event AdminInitialized(address initialOwner);
    event AdminUpgraded(address newImplementation);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);
        emit AdminInitialized(msg.sender);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {
        emit AdminUpgraded(newImplementation);
    }

    function initialized() public view returns (bool) {
        return _getInitializedVersion() > 0;
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
