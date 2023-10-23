import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers"; // Import the Signer type

describe("SimpleWallet", function () {
  let SimpleWallet: any; // Replace "any" with the contract type if available
  let simpleWallet: any; // Replace "any" with the contract instance type
  let owner: Signer;
  let user1: Signer;

  before(async function () {
    [owner, user1] = await ethers.getSigners();
    SimpleWallet = await ethers.getContractFactory("SimpleWallet");
    simpleWallet = await SimpleWallet.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await simpleWallet.owner()).to.equal(owner.address);
    });

    it("Should have a balance of 0", async function () {
      const balance = await simpleWallet.getBalance();
      expect(balance).to.equal(0);
    });
  });

  describe("Deposits and Withdrawals", function () {
    it("Should deposit and withdraw funds correctly", async function () {
      const depositAmount = ethers.utils.parseEther("1");
      await simpleWallet.deposit({ value: depositAmount });
      const initialBalance = await simpleWallet.getBalance();
      expect(initialBalance).to.equal(depositAmount);

      const withdrawAmount = ethers.utils.parseEther("0.5");
      await simpleWallet.withdraw(withdrawAmount);
      const finalBalance = await simpleWallet.getBalance();
      expect(finalBalance).to.equal(depositAmount.sub(withdrawAmount));
    });

    it("Should prevent withdrawals with insufficient balance", async function () {
      const initialBalance = await simpleWallet.getBalance();
      const withdrawAmount = ethers.utils.parseEther("2");
      await expect(simpleWallet.withdraw(withdrawAmount)).to.be.revertedWith(
        "Insufficient balance"
      );
    });
  });
});
