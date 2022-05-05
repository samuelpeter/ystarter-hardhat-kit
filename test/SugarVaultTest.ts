import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import e from "express";
import { ethers } from "hardhat";
import { IERC20, IVault, SugarVault, VaultAPI } from "typechain";
import { deployVault } from "./utils/deployVault";
import { deployYfi } from "./utils/deployYfi";

describe("Sugar vault Test", function () {
  let sugarVault: SugarVault;
  let vault: IVault;

  let token: IERC20;

  let gov: SignerWithAddress;
  let user: SignerWithAddress;
  let whale: SignerWithAddress;
  let rewards: SignerWithAddress;
  let guardian: SignerWithAddress;
  let management: SignerWithAddress;
  let strategist: SignerWithAddress;
  let keeper: SignerWithAddress;

  beforeEach(async function () {
    [gov, user, whale, guardian, rewards, management, strategist, keeper] = await ethers.getSigners();
    token = await deployYfi();
    vault = await deployVault({ gov, token, rewards, guardian, management });
  });

  it("testSetupOk", async () => {
    const b = await token.balanceOf(whale.address);

  });
});
