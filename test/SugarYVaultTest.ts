import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { BaseStrategyInitializable, IERC20, IVault, SugarYvault } from "typechain";
import { deployStrategy } from "./utils/deployStrategy";
import { deploySugarYVault } from "./utils/deploySugarYVault";
import { deployVault } from "./utils/deployVault";
import { deployYfi, YFI } from "./utils/deployYfi";

describe.only("SugarYVaultTest ", function () {
  let want: IERC20;
  let vault: IVault;
  let strategy: BaseStrategyInitializable;

  let sugarYVault: SugarYvault;

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
    want = await deployYfi();
    vault = await deployVault({ gov, token: want, rewards, guardian, management });
    strategy = await deployStrategy({ vault, keeper, strategist });
    sugarYVault = await deploySugarYVault(vault);

    await vault.addStrategy(strategy.address, 10000, BigNumber.from(0), ethers.constants.MaxUint256, BigNumber.from(1000));

    //Move some YFI to the whale
    await want.connect(gov).transfer(whale.address, YFI(10));
  });

  it("SetupOk", async () => {
    expect(sugarYVault.address).to.not.undefined;
    expect(await sugarYVault.vault()).to.equal(vault.address);
    expect(await sugarYVault.token()).to.equal(want.address);

    // console.log("address of sugar contract", address(sugar));
    // assertTrue(address(0) != address(sugar));
    // assertEq(address(sugar.vault()), address(vault));
    // assertEq(address(sugar.token()), address(want));
  });
});
