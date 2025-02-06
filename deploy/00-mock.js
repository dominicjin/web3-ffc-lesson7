const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("local network detected! deploying mock...")
        await deploy("MockV3Aggregator", {
            // name  whatever is ok
            contract: "MockV3Aggregator", // must be same to compled file
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mock deployed!")
        log("--------------------------------")
    }
}

module.exports.tags = ["all", "mock"]
