// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

// Overflow will be check by compiler after v0.8 so we don't need to use SafeMath here

import { CMInitializableUpgradeable } from '../base/CMInitializableUpgradeable.sol';
import { Config, ConfigOp } from './Config.sol';
import { MappingStorage } from './MappingStorage.sol';
import { SlotStorage } from './SlotStorage.sol';
import { WithdrawalStorage } from './WithdrawalStorage.sol';

contract Main is CMInitializableUpgradeable {
    using MappingStorage for bytes32;
    using SlotStorage for bytes32;
    using ConfigOp for bytes32;
    using WithdrawalStorage for bytes32;

    /**
     * @dev keccak256("main.commission.receipts.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): commissionReceipts
     *      Must be accessed with MappingStorage
     */
    bytes32 public constant MAIN_COMMISSION_RECEIPTS_MAPPING =
        0x79e39d54c71d3558a195d9515b7c9a0aa6dcee2b88f945d5eed743c6dd8509a5;

    /**
     * @dev keccak256("main.config.data.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): config data
     *      Must be access with SlotStorage
     */
    bytes32 public constant MAIN_CONFIG_DATA_SLOT =
        0xadb84ad8a4862921fc6493e28c6fa0189044757848a59eddd532deb88c319126;

    /**
     * @dev keccak256("main.operator.address.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): operator address
     *      Must be access with SlotStorage
     */
    bytes32 public constant MAIN_OPERATOR_ADDRESS_SLOT =
        0xf6c5e7d7d5789769e3c464c0b499fd029db3d5849af3fdad017a823629918464;

    /**
     * @dev keccak256("main.user.shares.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): user shares
     *      Must be accessed with MappingStorage
     */
    bytes32 public constant MAIN_USER_SHARES_MAPPING =
        0xdbb46e61d3e35257eb951d87f1710af234ecb6ccb4b676ecb952612b33d87050;

    /**
     * @dev keccak256("main.buffered.ether.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): user shares
     *      Must be accessed with MappingStorage
     */
    bytes32 public constant MAIN_BUFFERED_ETHER_SLOT =
        0xeb98621353a85d0d2d4f455455db3d1eda872da1a6aba114c27cd05b45775645;

    /**
     * @dev keccak256("main.total.shares.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): user shares
     *      Must be accessed with MappingStorage
     */
    bytes32 public constant MAIN_TOTAL_SHARES_SLOT =
        0xb6175897dca017c9ccf994308329506f5db5b0512e280d615933460ca9b40225;

    /**
     * @dev keccak256("main.withdrawal.queue.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): user shares
     *      Must be accessed with MappingStorage
     */
    bytes32 public constant MAIN_WITHDRAWAL_REQUEST_QUEUE_MAPPING =
        0xb1b6f724d9562fbe3d90536503c8c524fb630d99fc4e5c10a99a29a67e9226f3;

    /**
     * @dev keccak256("main.withdrawal.request.id.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): user shares
     *      Must be accessed with MappingStorage
     */
    bytes32 public constant MAIN_WITHDRAWAL_REQUEST_ID_SLOT =
        0xb93b9e453cb86e684f34210434427249b3755c1caadbca99804487ee1a46b7e8;

    /**
     * @dev keccak256("main.finalized.withdrawal.request.id.96a1d2f2-7cbc-11ef-b5ff-af7f5d30d39a"): user shares
     *      Must be accessed with MappingStorage
     */
    bytes32 public constant MAIN_FINALIZED_WITHDRAWAL_REQUEST_ID_SLOT =
        0xd2d0278c29e14f6ef5f34c512b3299d0142311c00df54d74473c30e4bced1cde;

    /**
     * @dev errors
     */
    error InvalidSender();
    error InvalidFeeRatio();
    error PermissionDenied();
    error InvalidValue();
    error InvalidShares(uint256, uint256);
    error InvalidRequestId(uint256, uint256);
    error TransferFailed(address, uint256);

    /**
     * @dev modifiers
     */
    modifier mustOperatorOrOwner() {
        if (
            msg.sender != MAIN_OPERATOR_ADDRESS_SLOT.getAddress() &&
            msg.sender != owner()
        ) {
            revert InvalidSender();
        }
        _;
    }

    modifier notPaused() {
        if (MAIN_CONFIG_DATA_SLOT.getConfig().paused != 0) {
            revert PermissionDenied();
        }
        _;
    }

    /**
     * @dev events
     */
    event Submitted(address indexed sender, uint256 amount, address referral);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev initialize
     */
    function initialize(address initialOwner) public override initializer {
        super.initialize(initialOwner);
        initializeBalance();
    }

    function initializeBalance() internal {
        uint256 balance = address(this).balance;
        assert(balance != 0);

        MAIN_BUFFERED_ETHER_SLOT.setUint256(balance);
        if (balance != 0) {
            MAIN_USER_SHARES_MAPPING.setAddressUint256(msg.sender, balance);
            MAIN_TOTAL_SHARES_SLOT.setUint256(balance);
        }
    }

    function pause() public mustOperatorOrOwner {
        Config.Data memory config = MAIN_CONFIG_DATA_SLOT.getConfig();
        config.paused = 1;
        MAIN_CONFIG_DATA_SLOT.setConfig(config);
    }

    function resume() public mustOperatorOrOwner {
        Config.Data memory config = MAIN_CONFIG_DATA_SLOT.getConfig();
        config.paused = 0;
        MAIN_CONFIG_DATA_SLOT.setConfig(config);
    }

    function configure(Config.Data calldata config) public onlyOwner {
        MAIN_CONFIG_DATA_SLOT.setConfig(config);
    }

    function setOperatorAddress(address _addr) public onlyOwner {
        MAIN_OPERATOR_ADDRESS_SLOT.setAddress(_addr);
    }

    function addCommissionReceipt(
        address _addr,
        uint32 ratio
    ) public mustOperatorOrOwner {
        Config.Data memory config = MAIN_CONFIG_DATA_SLOT.getConfig();
        uint256 feeRatio = MAIN_COMMISSION_RECEIPTS_MAPPING.getAddressUint256(
            _addr
        );

        config.totalFeeRatio += uint32(ratio - feeRatio);
        if (config.totalFeeRatio <= config.maxTotalFeeRatio) {
            revert InvalidFeeRatio();
        }

        MAIN_CONFIG_DATA_SLOT.setConfig(config);
        MAIN_COMMISSION_RECEIPTS_MAPPING.setAddressUint256(_addr, ratio);
    }

    function calculateShare(
        uint256 eth,
        uint256 totalShares,
        uint256 totalEther
    ) internal pure returns (uint256) {
        if (totalShares == 0) {
            return eth;
        }
        return (eth * totalShares) / totalEther;
    }

    function calculateETH(
        uint256 shares,
        uint256 totalShares,
        uint256 totalEther
    ) internal pure returns (uint256) {
        return (shares * totalEther) / totalShares;
    }

    function submit(
        address _referral
    ) public payable notPaused returns (uint256) {
        if (msg.value == 0) revert InvalidValue();

        uint256 totalShares = MAIN_TOTAL_SHARES_SLOT.getUint256();
        uint256 totalEther = MAIN_BUFFERED_ETHER_SLOT.getUint256();

        uint256 userShare = calculateShare(msg.value, totalShares, totalEther);

        MAIN_USER_SHARES_MAPPING.setAddressUint256(msg.sender, userShare);
        MAIN_TOTAL_SHARES_SLOT.setUint256(totalShares + msg.value);
        MAIN_BUFFERED_ETHER_SLOT.setUint256(totalEther + msg.value);

        emit Submitted(msg.sender, msg.value, _referral);

        return userShare;
    }

    function withdraw(uint256 shares) public returns (uint256 requestId) {
        requestId = MAIN_WITHDRAWAL_REQUEST_ID_SLOT.getUint256();
        WithdrawalStorage.WithdrawalRequest
            storage lastRequest = MAIN_WITHDRAWAL_REQUEST_QUEUE_MAPPING
                .getWithdrawalRequest(requestId);

        uint256 totalShares = MAIN_TOTAL_SHARES_SLOT.getUint256();
        uint256 totalEther = MAIN_BUFFERED_ETHER_SLOT.getUint256();
        uint256 userShare = MAIN_USER_SHARES_MAPPING.getAddressUint256(
            msg.sender
        );

        if (shares > userShare) revert InvalidShares(shares, userShare);

        // 1: Sub user share
        MAIN_USER_SHARES_MAPPING.setAddressUint256(
            msg.sender,
            userShare - shares
        );

        // 2: Calculate withdraw ETH amount
        uint256 eth = calculateETH(shares, totalShares, totalEther);

        // 3. Increase requestId
        ++requestId;

        // 3: Create withdrawl request
        WithdrawalStorage.WithdrawalRequest
            memory newRequest = WithdrawalStorage.WithdrawalRequest(
                lastRequest.cumulativeETH + eth,
                lastRequest.cumulativeShares + shares,
                msg.sender,
                uint40(block.timestamp),
                false
            );
        MAIN_WITHDRAWAL_REQUEST_QUEUE_MAPPING.enqueueWithdrawalRequest(
            requestId,
            newRequest
        );

        // 4: Return requestId
        return requestId;
    }

    function serveWithdrawalRequests(
        uint256 lastCandidateRequestId
    ) public mustOperatorOrOwner {
        uint256 finalizedRequestId = MAIN_FINALIZED_WITHDRAWAL_REQUEST_ID_SLOT
            .getUint256();
        uint256 requestId = MAIN_WITHDRAWAL_REQUEST_ID_SLOT.getUint256();

        if (
            lastCandidateRequestId < finalizedRequestId ||
            lastCandidateRequestId > requestId
        ) {
            revert InvalidRequestId(finalizedRequestId, lastCandidateRequestId);
        }

        MAIN_FINALIZED_WITHDRAWAL_REQUEST_ID_SLOT.setUint256(
            lastCandidateRequestId
        );
    }

    function claim(uint256 requestId) public {
        uint256 finalizedRequestId = MAIN_FINALIZED_WITHDRAWAL_REQUEST_ID_SLOT
            .getUint256();
        if (requestId > finalizedRequestId)
            revert InvalidRequestId(requestId, finalizedRequestId);

        WithdrawalStorage.WithdrawalRequest
            memory request = MAIN_WITHDRAWAL_REQUEST_QUEUE_MAPPING
                .getWithdrawalRequest(requestId);
        if (request.owner != msg.sender) revert PermissionDenied();
        if (request.claimed) revert PermissionDenied();
        request.claimed = true;

        WithdrawalStorage.WithdrawalRequest
            memory prevRequest = MAIN_WITHDRAWAL_REQUEST_ID_SLOT
                .getWithdrawalRequest(requestId - 1);
        uint256 eth = request.cumulativeETH - prevRequest.cumulativeETH;

        (bool success, ) = msg.sender.call{ value: eth }('');
        if (!success) revert TransferFailed(msg.sender, eth);
    }
}
