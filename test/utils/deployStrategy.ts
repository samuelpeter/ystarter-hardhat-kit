import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { BaseStrategy, BaseStrategyInitializable, MockStrategy } from "typechain";

interface DeployStrategyArgs {
  keeper: SignerWithAddress;
}

export const deployStrategy = async ({ keeper }: DeployStrategyArgs): Promise<BaseStrategyInitializable> => {
  const MockStrategyFactory = await ethers.getContractFactory("MockStrategy");
  const strategy = (await MockStrategyFactory.deploy(18, "YFI")) as MockStrategy;
  await strategy.setKeeper(keeper.address);
  return strategy;
};
