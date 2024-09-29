// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

// Overflow will be check by compiler after v0.8 so we don't need to use SafeMath here

import { CMInitializableUpgradeable } from '../base/CMInitializableUpgradeable.sol';
import { Config, ConfigOp } from './Config.sol';
import { MappingStorage } from './MappingStorage.sol';
import { SlotStorage } from './SlotStorage.sol';

contract Main is CMInitializableUpgradeable {
    using MappingStorage for bytes32;
    using SlotStorage for bytes32;
    using ConfigOp for bytes32;

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
     * @dev errors
     */
    error InvalidSender();
    error InvalidFeeRatio();
    error PermissionDenied();
    error InvalidValue();

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
        uint256 amount,
        uint256 totalShares,
        uint256 totalEther
    ) internal returns (uint256) {
        if (totalShares == 0) {
            return msg.value;
        }
        return (amount * totalShares) / totalEther;
    }

    function submit(
        address _referral
    ) public payable notPaused returns (uint256) {
        if (msg.value == 0) {
            revert InvalidValue();
        }

        uint256 totalShares = MAIN_TOTAL_SHARES_SLOT.getUint256();
        uint256 totalEther = MAIN_BUFFERED_ETHER_SLOT.getUint256();

        uint256 userShare = calculateShare(msg.value, totalShares, totalEther);

        MAIN_USER_SHARES_MAPPING.setAddressUint256(msg.sender, userShare);
        MAIN_TOTAL_SHARES_SLOT.setUint256(totalShares + msg.value);
        MAIN_BUFFERED_ETHER_SLOT.setUint256(totalEther + msg.value);

        emit Submitted(msg.sender, msg.value, _referral);

        return userShare;
    }
}
