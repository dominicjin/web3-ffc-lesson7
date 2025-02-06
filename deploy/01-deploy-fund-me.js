// import
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()
module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // main function

    // calling of main function

    // function deployFunc() {
    //     console.log("hi")
    // }

    // module.exports.default = deployFunc

    // //hre: hardhat runtime environment
    // module.exports = async(hre){
    //     const {deployments, getNamedAccounts} = hre;
    // }

    // choose network
    // ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        ethUsdPriceFeedAddress = (await deployments.get("MockV3Aggregator")) // search the name of the contract
            .address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the contractr doesn't exist, deploy a minial version
    // for our local testing
    log("Deploying FundMe contract")
    // when deploy locally, we want to use a mock
    // what happen when we deploy to another mainnet?
    const args = [ethUsdPriceFeedAddress]
    const fundme = await deploy("Fundme", {
        contract: "Fundme",
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    // console.log(fundme)

    // if (
    //     !developmentChains.includes(network.name) &&
    //     process.env.ETHERSCAN_API_KEY
    // ) {
    //     log("Verifying FundMe contract")
    //     await verify(fundme.target, args)
    // }

    log("FundMe deployed")
    log("--------------------------------")
}

module.exports.tags = ["all", "fundme"]

// module.exports = async ({
//   getNamedAccounts,
//   deployments,
//   getChainId,
//   getUnnamedAccounts,
// }) => {
//   const {deploy} = deployments;
//   const {deployer} = await getNamedAccounts();

//   // the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
//   await deploy('GenericMetaTxProcessor', {
//     from: deployer,
//     gasLimit: 4000000,
//     args: [],
//   });
// };
