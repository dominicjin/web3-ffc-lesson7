require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("hardhat-gas-reporter")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.7",
    solidity: {
        compilers: [
            {
                version: "0.6.6",
            },
            {
                version: "0.8.7",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SEPOLIA_PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 2,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user1: {
            default: 1,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        // outputFile: "gas-reportError.txt",
        noColors: true,
        currency: "USD",
        // token: "MATIC",
        coinmarketcap: COINMARKET_API_KEY,
        L1: "ethereum",
        L1Etherscan: ETHERSCAN_API_KEY,
    },
}
