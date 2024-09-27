// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

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
     * @dev errors
     */
    error InvalidSender();
    error InvalidFeeRatio();

    /**
     * @dev modifiers
     */
    modifier mustOperatorOrOwner() {
        if (
            msg.sender == MAIN_OPERATOR_ADDRESS_SLOT.getAddress() ||
            msg.sender == owner()
        ) {
            revert InvalidSender();
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

    function submit(address _referral) public payable returns (uint256) {
        // TODO: calculate share with current pool amount
        MAIN_USER_SHARES_MAPPING.setAddressUint256(msg.sender, msg.value);
        emit Submitted(msg.sender, msg.value, _referral);
        // TODO: return calculated share
        return msg.value;
    }
}
