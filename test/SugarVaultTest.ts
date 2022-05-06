import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import exp from "constants";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { BaseStrategy, BaseStrategyInitializable, IERC20, IERC4626, IVault, SugarVault, VaultWrapper } from "typechain";
import { deployStrategy } from "./utils/deployStrategy";
import { deploySugarVault } from "./utils/deploySugarVault";
import { deployVault } from "./utils/deployVault";
import { deployVaultWrapper } from "./utils/deployVaultWrapper";
import { deployYfi, YFI } from "./utils/deployYfi";

describe("Sugar vault Test", function () {
  let want: IERC20;
  let vault: IVault;
  let strategy: BaseStrategyInitializable;

  let vaultWrapper: IERC4626;
  let sugarVault: SugarVault;

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
    strategy = await deployStrategy({ vault, keeper });
    vaultWrapper = await deployVaultWrapper(vault);
    sugarVault = await deploySugarVault(vaultWrapper);

    await vault.addStrategy(strategy.address, 10000, BigNumber.from(0), ethers.constants.MaxUint256, BigNumber.from(1000));

    //Move some YFI to the whale
    await want.connect(gov).transfer(whale.address, YFI(10));
  });

  it("SetupOk", async () => {
    expect(sugarVault.address).to.not.undefined;
    expect(await sugarVault.vault()).to.equal(vaultWrapper.address);
    expect(await sugarVault.token()).to.equal(want.address);
  });

  it("StartSharingYield", async () => {
    const ammount = YFI(10);

    await want.connect(whale).approve(sugarVault.address, ammount);
    await sugarVault.connect(whale).startSharingYield(user.address, ammount);

    //TODO ask storming0x if its correct that the shares belonging to the wraper and not to sugar vault
    const shares = await vault.balanceOf(vaultWrapper.address);

    expect(await sugarVault.tokenBalances(whale.address)).to.equal(ammount.toString());
    expect(await sugarVault.shareBalances(whale.address)).to.equal(await vaultWrapper.convertToShares(ammount));

    expect(shares).to.equal(await vaultWrapper.convertToShares(ammount));
    expect(await vaultWrapper.balanceOf(sugarVault.address)).to.equal(await vaultWrapper.convertToShares(ammount));

    expect(await want.balanceOf(whale.address)).to.equal(0);

    /*
   

    // asserts
    assertEq(sugar.tokenBalances(whale), _amount);
    assertEq(
        sugar.shareBalances(whale),
        vaultWrapper.convertToShares(_amount)
    );
    assertEq(shares, vaultWrapper.convertToShares(_amount));
    assertEq(
        vaultWrapper.balanceOf(address(sugar)),
        vaultWrapper.convertToShares(_amount)
    );
    assertEq(want.balanceOf(whale), 0); */
  });
});
