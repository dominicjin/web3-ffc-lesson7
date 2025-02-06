const { ethers, network, deployments } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundme, fundmeDeployment
          let deployer
          const sendValue = ethers.parseEther("1")

          beforeEach(async function () {
              deployer = await ethers.getSigner()
              fundmeDeployment = await deployments.get("Fundme")
              console.log(fundmeDeployment)

              fundme = await ethers.getContractAt(
                  fundmeDeployment.abi,
                  fundmeDeployment.address,
                  deployer,
              )
          })

          it("allows people to fund and withdraw", async function () {
              await fundme.fund({ value: sendValue })
              await fundme.withdraw()
              const endBalance = await ethers.provider.getBalance(fundme.target)
              assert.equal(endBalance, 0)
          })

          // deployer = await
      })
