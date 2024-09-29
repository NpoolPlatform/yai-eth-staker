// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library WithdrawalStorage {
    struct WithdrawalRequest {
        uint256 cumulativeETH;
        uint256 cumulativeShares;
        address owner;
        uint40 timestamp;
        bool claimed;
    }

    function getWithdrawalRequestQueue(
        bytes32 _position
    )
        internal
        pure
        returns (mapping(uint256 => WithdrawalRequest) storage result)
    {
        assembly {
            result.slot := _position
        }
    }

    function enqueueWithdrawalRequest(
        bytes32 _position,
        uint256 requestId,
        WithdrawalRequest memory request
    ) internal {
        getWithdrawalRequestQueue(_position)[requestId] = request;
    }

    function getWithdrawalRequest(
        bytes32 _position,
        uint256 requestId
    ) internal view returns (WithdrawalRequest storage) {
        return getWithdrawalRequestQueue(_position)[requestId];
    }
}
