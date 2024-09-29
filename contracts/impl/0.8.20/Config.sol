// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

import { SlotStorage } from './SlotStorage.sol';

library Config {
    struct Data {
        uint32 mintWrapperAsset;
        uint32 totalFeeRatio;
        uint32 maxTotalFeeRatio;
        uint32 paused;
        bytes8 wrapperAssetTicker;
        bytes8 reserved;
    }
}

library ConfigOp {
    using SlotStorage for bytes32;

    uint256 internal constant MINT_WRAPPER_ASSET_OFFSET = 0;
    uint256 internal constant TOTAL_FEE_RATIO_OFFSET = 32;
    uint256 internal constant MAX_TOTAL_FEE_RATIO_OFFSET = 64;
    uint256 internal constant WRAPPER_ASSET_TICKER_OFFSET = 96;

    function getConfig(
        bytes32 _position
    ) internal view returns (Config.Data memory config) {
        uint256 v = _position.getUint256();

        config.mintWrapperAsset = uint32(v >> MINT_WRAPPER_ASSET_OFFSET);
        config.totalFeeRatio = uint32(v >> TOTAL_FEE_RATIO_OFFSET);
        config.maxTotalFeeRatio = uint32(v >> MAX_TOTAL_FEE_RATIO_OFFSET);
        config.wrapperAssetTicker = bytes8(
            uint64(v >> WRAPPER_ASSET_TICKER_OFFSET)
        );
    }

    function setConfig(bytes32 _position, Config.Data memory config) internal {
        _position.setUint256(
            (uint256(config.mintWrapperAsset) << MINT_WRAPPER_ASSET_OFFSET) |
                (uint256(config.totalFeeRatio) << TOTAL_FEE_RATIO_OFFSET) |
                (uint256(config.maxTotalFeeRatio) <<
                    MAX_TOTAL_FEE_RATIO_OFFSET) |
                (uint256(uint64(config.wrapperAssetTicker)) <<
                    WRAPPER_ASSET_TICKER_OFFSET)
        );
    }
}
