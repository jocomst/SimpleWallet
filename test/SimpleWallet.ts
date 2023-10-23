import { expect } from "chai";
import "@nomicfoundation/hardhat-toolbox";
import { Signer, ContractFactory } from "ethers";
import hre, { ethers } from "hardhat";

describe("SimpleWallet", function () {
  let SimpleWallet: ContractFactory;
  let simpleWallet: any;
  let owner: Signer;
  let user1: Signer;

  before(async function () {
    [owner, user1] = await hre.ethers.getSigners();
    SimpleWallet = await hre.ethers.getContractFactory("SimpleWallet");
    simpleWallet = await SimpleWallet.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const ownerAddress = await owner.getAddress();
      const contractOwner = await simpleWallet.owner();
      expect(contractOwner).to.equal(ownerAddress);
    });

    it("Should have a balance of 0", async function () {
      const balance = await hre.ethers.provider.getBalance(
        simpleWallet.address
      );
      expect(balance).to.equal(0);
    });
  });

  describe("Deposits and Withdrawals", function () {
    it("Should deposit and withdraw funds correctly", async function () {
      const depositAmount = ethers.parseEther("1");
      await simpleWallet.deposit({ value: depositAmount });
      const initialBalance = await hre.ethers.provider.getBalance(
        simpleWallet.address
      );
      expect(initialBalance).to.equal(depositAmount);

      const withdrawAmount = ethers.parseEther("0.5");
      await simpleWallet.withdraw(withdrawAmount);
      const finalBalance = await hre.ethers.provider.getBalance(
        simpleWallet.address
      );
      expect(finalBalance).to.equal(depositAmount - withdrawAmount);
    });

    it("Should prevent withdrawals with insufficient balance", async function () {
      const initialBalance = await hre.ethers.provider.getBalance(
        simpleWallet.address
      );
      const withdrawAmount = ethers.parseEther("2");
      await expect(simpleWallet.withdraw(withdrawAmount)).to.be.rejectedWith(
        "Insufficient balance"
      );
    });
  });
});
