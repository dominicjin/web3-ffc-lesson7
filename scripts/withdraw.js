const { ethers, deployments } = require("hardhat")

async function main() {
    let deployer
    let fundme, fundmeDeployment
    deployer = (await ethers.getSigners())[0]
    // fundmeDeployment = await deployments.get("Fundme")
    fundmeDeployment = await deployments.get("Fundme")
    // ethers.getContractFactoryWithSignerAddress
    // console.log(fundmeDeployment.address)
    fundme = await ethers.getContractAt(
        fundmeDeployment.abi,
        fundmeDeployment.address,
        deployer,
    )
    console.log(fundme.target)
    console.log("funding contract....")
    const transactionResponse = await fundme.withdraw()
    await transactionResponse.wait(1)
    console.log("Funded")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
