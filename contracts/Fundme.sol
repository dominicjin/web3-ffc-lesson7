// SPDX-License-Identifier: MIT
// praga
pragma solidity ^0.8.7;

// import
import "./PriceConverter.sol";

// // custom error
error FundMe_NotOwner();

// interfaces, libraries, contracts

// @title A contract for crowd funding
// @author J
// @notice This contract is to demo a sample funding contract
// @dev This implements price fees as our library
contract Fundme {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    uint256 public minUSD = 1 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_fundersToAmountFunded;

    // immutable and constant
    // constant can only be assigned when initializing
    // immutable can only be assigned onece
    address private immutable i_owner;
    AggregatorV3Interface public s_priceFeed;

    // Modifiers
    // _; represents implement the rest code
    modifier isOwner() {
        // require(i_owner == msg.sender, "Sender is not the owner");
        if (i_owner != msg.sender) {
            revert FundMe_NotOwner();
        }
        _;
    }

    // Functions Orders:
    /// constructor
    /// receive
    /// fallback
    /// external
    /// public
    /// internal
    /// private
    /// view / pure

    //constructer will be called once the contract is on the chain
    //it's a good way to pick the owner
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    /**
     * @notice Fund the contract
     * @dev This implements price feeds as our library
     */
    // msg value is returned in WEI 10**18
    function fund() public payable {
        // PriceConverter.getConversionRate(msg.value);
        require(
            msg.value.getConversionRate(s_priceFeed) >= minUSD,
            "Didn't send enough"
        );
        // if (msg.value.getConversionRate(s_priceFeed) < minUSD) {
        //     revert notOwner();
        // }

        s_funders.push(msg.sender);
        s_fundersToAmountFunded[msg.sender] += msg.value;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getFundersToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_fundersToAmountFunded[funder];
    }

    function withdraw() public payable isOwner {
        // notice: it is not convenient to check in every function, so we introduce modifier
        // require(i_owner == msg.sender, "Sender is not the owner");

        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            s_fundersToAmountFunded[s_funders[funderIndex]] = 0;
        }

        //reset the array, 0 represents 0 element
        s_funders = new address[](0);

        // only payable address can use transfer
        // "this" means the whole contract
        // (bool callSuccess, bytes memory data) is the return of call
        // how is "call" used call{}()????
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function cheaperWithdraw() public payable isOwner {
        address[] memory funders = s_funders;
        // mapping can't be in memory
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            s_fundersToAmountFunded[funders[funderIndex]] = 0;
        }

        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call failed");
    }
}
