const { ethers, deployments, network, getNamedAccounts } = require("hardhat")
const { expect, assert } = require("chai")

describe("fundme", function () {
    let deployer, fundme, mockV3Aggregator
    let accounts, accountZero
    // parseUnits("12","wei")
    const sendValue = ethers.parseEther("1")

    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]

        await deployments.fixture(["all"])
        // fundmeDeployment = await Deploments["Fundme"]
        fundmeDeployment = await deployments.get("Fundme")
        mockV3AggregatorDeployment = await deployments.get("MockV3Aggregator")

        fundme = await ethers.getContractAt(
            fundmeDeployment.abi,
            fundmeDeployment.address,
            deployer,
        )

        mockV3Aggregator = await ethers.getContractAt(
            mockV3AggregatorDeployment.abi,
            mockV3AggregatorDeployment.address,
            deployer,
        )
    })

    describe("construct test", async function () {
        it("sets the aggregator address correctly", async function () {
            const response = await fundme.getPriceFeed()
            assert.equal(response, mockV3Aggregator.target)
        })

        it("sets the owner correctly", async function () {
            const response = await fundme.getOwner()
            assert.equal(response, deployer.address)
        })
    })

    describe("fund test", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundme.fund()).to.be.revertedWith("Didn't send enough")
        })

        it("updated the amount funded data structure", async function () {
            await fundme.fund({ value: sendValue })
            // const response = await fundme.getFundersToAmountFunded(
            //     deployer.address,
            // )
            //
            // @notice extract mapping or array from constract, use them as a function
            const response = await fundme.getFundersToAmountFunded(
                deployer.address,
            )
            assert.equal(response.toString(), sendValue.toString())
        })

        it("Adds funder to array of getFunders", async function () {
            await fundme.fund({ value: sendValue })
            const funder = await fundme.getFunders(0)
            assert.equal(funder, deployer.address)
        })
    })

    describe("withdraw test", async function () {
        beforeEach(async function () {
            await fundme.fund({ value: sendValue })
        })

        it("owner withdraw ", async function () {
            // Arrange
            const startFundMeBalance = await ethers.provider.getBalance(
                fundme.target,
            )
            const startDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )

            //Act
            const transactionResponse = await fundme.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const endFundMeBalance = await ethers.provider.getBalance(
                fundme.target,
            )
            const endDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )
            // const gasCost = transactionReceipt.fee
            // const {gasUsed, }
            const { gasPrice, gasUsed } = transactionReceipt
            const gasCost = gasPrice * gasUsed

            // assert
            assert.equal(endFundMeBalance, 0)
            assert.equal(
                startFundMeBalance + startDeployerBalance,
                endDeployerBalance + gasCost,
            )
        })

        it("allows us to withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners() //accounts is a global variable
            // console.log(accounts[0].address)
            for (let i = 1; i < 6; i++) {
                const funderConnectContract = await ethers.getContractAt(
                    fundmeDeployment.abi,
                    fundmeDeployment.address,
                    accounts[i],
                )
                await funderConnectContract.fund({ value: sendValue })
            }

            const startFundMeBalance = await ethers.provider.getBalance(
                fundme.target,
            )
            const startDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )

            //Act
            const transactionResponse = await fundme.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const endFundMeBalance = await ethers.provider.getBalance(
                fundme.target,
            )
            const endDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )
            // const gasCost = transactionReceipt.fee
            // const {gasUsed, }
            const { gasPrice, gasUsed } = transactionReceipt
            const gasCost = gasPrice * gasUsed

            // assert
            assert.equal(endFundMeBalance, 0)
            assert.equal(
                startFundMeBalance + startDeployerBalance,
                endDeployerBalance + gasCost,
            )

            // make sure that funders are reset properly
            expect(fundme.getFunders(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundme.getFundersToAmountFunded(accounts[i].address),
                    0,
                )
            }
        })

        it("cheaper withdraw testing", async function () {
            const accounts = await ethers.getSigners() //accounts is a global variable
            // console.log(accounts[0].address)
            for (let i = 1; i < 6; i++) {
                const funderConnectContract = await ethers.getContractAt(
                    fundmeDeployment.abi,
                    fundmeDeployment.address,
                    accounts[i],
                )
                await funderConnectContract.fund({ value: sendValue })
            }

            const startFundMeBalance = await ethers.provider.getBalance(
                fundme.target,
            )
            const startDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )

            //Act
            const transactionResponse = await fundme.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const endFundMeBalance = await ethers.provider.getBalance(
                fundme.target,
            )
            const endDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )
            // const gasCost = transactionReceipt.fee
            // const {gasUsed, }
            const { gasPrice, gasUsed } = transactionReceipt
            const gasCost = gasPrice * gasUsed

            // assert
            assert.equal(endFundMeBalance, 0)
            assert.equal(
                startFundMeBalance + startDeployerBalance,
                endDeployerBalance + gasCost,
            )

            // make sure that getFunders are reset properly
            expect(fundme.getFunders(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundme.getFundersToAmountFunded(accounts[i].address),
                    0,
                )
            }
        })

        it("attacker cannot withdraw", async function () {
            attacker = (await ethers.getSigners())[1]

            const attack_connect = await ethers.getContractAt(
                fundmeDeployment.abi,
                fundmeDeployment.address,
                attacker,
            )
            // const response = await attack_connect.withdraw()
            await expect(
                attack_connect.withdraw(),
            ).to.be.revertedWithCustomError(attack_connect, "FundMe_NotOwner")
            // revertedWithCustomError(contract, custom error)   ===> contract is the variable name in the code which points at the specific contract
        })
    })
})
