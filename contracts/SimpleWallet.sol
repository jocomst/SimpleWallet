// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleWallet {
    address public owner;
    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    // Deposit funds into the contract
    function deposit() public payable {
        require(msg.value > 0, "Amount to deposit must be greater than 0");
        balances[msg.sender] += msg.value;
    }

    // Withdraw funds from the contract
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Get the contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
