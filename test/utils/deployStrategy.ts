import { ethers } from "hardhat";
import { BaseStrategy, BaseStrategyInitializable, MockStrategy } from "typechain";

export const deployStrategy = async (): Promise<BaseStrategyInitializable> => {
  const TokenFactory = await ethers.getContractFactory("MockStrategy");
  return (await TokenFactory.deploy(18, "YFI")) as MockStrategy;
};
