import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

const main = async () => {
  const Transactions: ContractFactory = await ethers.getContractFactory("Transactions");
  const transactions: Contract = await Transactions.deploy();

  await transactions.deployed();

  console.log(`Transaction deployed to : ${transactions.address}`);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();