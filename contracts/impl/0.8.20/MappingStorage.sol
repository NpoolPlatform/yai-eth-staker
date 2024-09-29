// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

library MappingStorage {
    using EnumerableSet for EnumerableSet.UintSet;

    function getAddressUint256Mapping(
        bytes32 _position
    ) internal pure returns (mapping(address => uint256) storage result) {
        assembly {
            result.slot := _position
        }
    }

    function setAddressUint256(
        bytes32 _position,
        address _key,
        uint256 _value
    ) internal {
        getAddressUint256Mapping(_position)[_key] = _value;
    }

    function getAddressUint256(
        bytes32 _position,
        address _key
    ) internal view returns (uint256) {
        return getAddressUint256Mapping(_position)[_key];
    }

    function deleteAddressUint256(bytes32 _position, address _key) internal {
        delete getAddressUint256Mapping(_position)[_key];
    }

    function getAddressEnumerableSetUintSet(
        bytes32 _position
    )
        internal
        pure
        returns (mapping(address => EnumerableSet.UintSet) storage result)
    {
        assembly {
            result.slot := _position
        }
    }

    function addAddressEnumerableSetUintSet(
        bytes32 _position,
        address _key,
        uint256 _value
    ) internal {
        getAddressEnumerableSetUintSet(_position)[_key].add(_value);
    }

    function removeAddressEnumerableSetUintSet(
        bytes32 _position,
        address _key,
        uint256 _value
    ) internal {
        getAddressEnumerableSetUintSet(_position)[_key].remove(_value);
    }

    function countAddressEnumerableSetUintSet(
        bytes32 _position,
        address _key
    ) internal view returns (uint256) {
        return getAddressEnumerableSetUintSet(_position)[_key].length();
    }

    function getAddressEnumerableSetUintSetValues(
        bytes32 _position,
        address _key
    ) internal view returns (uint256[] memory) {
        return getAddressEnumerableSetUintSet(_position)[_key].values();
    }
}
