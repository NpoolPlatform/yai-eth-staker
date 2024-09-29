// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

import { Initializable } from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { ERC1967Utils } from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol';

// All upgradable contract need to inherit this contract
abstract contract CMInitializableUpgradeable is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    function initialize(address initialOwner) public virtual initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(initialOwner);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {
        // DO NOTHING
    }

    function initialized() public view returns (bool) {
        return _getInitializedVersion() > 0;
    }

    function getImplementation() public view returns (address) {
        return ERC1967Utils.getImplementation();
    }
}
