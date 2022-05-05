import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { BaseStrategy, BaseStrategyInitializable, IVault, MockStrategy } from "typechain";

interface DeployStrategyArgs {
  vault: IVault;
  keeper: SignerWithAddress;
}

export const deployStrategy = async ({ keeper, vault }: DeployStrategyArgs): Promise<BaseStrategyInitializable> => {
  const MockStrategyFactory = await ethers.getContractFactory("MockStrategy");
  const strategy = (await MockStrategyFactory.deploy(vault.address)) as MockStrategy;
  await strategy.setKeeper(keeper.address);
  return strategy;
};
