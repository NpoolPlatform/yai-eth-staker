// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

/**
 * @notice Aragon Unstructured Storage library
 */
library SlotStorage {
    function getBool(bytes32 position) internal view returns (bool data) {
        assembly {
            data := sload(position)
        }
    }

    function getAddress(bytes32 position) internal view returns (address data) {
        assembly {
            data := sload(position)
        }
    }

    function getBytes32(bytes32 position) internal view returns (bytes32 data) {
        assembly {
            data := sload(position)
        }
    }

    function getUint256(bytes32 position) internal view returns (uint256 data) {
        assembly {
            data := sload(position)
        }
    }

    function setBool(bytes32 position, bool data) internal {
        assembly {
            sstore(position, data)
        }
    }

    function setAddress(bytes32 position, address data) internal {
        assembly {
            sstore(position, data)
        }
    }

    function setBytes32(bytes32 position, bytes32 data) internal {
        assembly {
            sstore(position, data)
        }
    }

    function setUint256(bytes32 position, uint256 data) internal {
        assembly {
            sstore(position, data)
        }
    }
}
