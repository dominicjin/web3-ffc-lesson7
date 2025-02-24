const { run } = require("hardhat")

const verify = async function (contractAddress, args) {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        console.log(error)
        // if (error.messsage.toLowerCase().includes("already verified")) {
        //     console.log("Contract already verified")
        // } else {
        //     console.log(error)
        // }
    }
}

module.exports = { verify }
