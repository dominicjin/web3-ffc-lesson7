// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // Sepolia Testnet
        // 0x694AA1769357215DE4FAC081bf1f309aDC325306 ETH/USD

        (, int256 price, , , ) = priceFeed.latestRoundData();
        // answer * 10 ** 10, according to decimals = 8
        return uint256(price * 1e10);
        // ETH/USD in WEI
    }

    // function getVersion() internal view returns (uint256) {
    //     return
    //         AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306)
    //             .version();
    // }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethprice = getPrice(priceFeed);
        // ethprice and ethAmound have 18decimals, so we need to divide one
        uint256 ethAmountInUsd = (ethprice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
