import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { BaseStrategyInitializable, IERC20, IVault, SugarYvault } from "typechain";
import { deployStrategy } from "./utils/deployStrategy";
import { deploySugarYVault } from "./utils/deploySugarYVault";
import { deployVault } from "./utils/deployVault";
import { deployYfi, YFI } from "./utils/deployYfi";
import { convertToShares } from "./utils/helper/convertToShares";



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
  });

  it("StartSharingYield", async () => {
    const ammount = YFI(10);

    await want.connect(whale).approve(sugarYVault.address, ammount);
    await sugarYVault.connect(whale).startSharingYield(user.address, ammount);

    //TODO ask storming0x if its correct that the shares belonging to the wraper and not to sugar vault
    const shares = await vault.balanceOf(sugarYVault.address);

    expect(await sugarYVault.tokenBalances(whale.address)).to.equal(ammount.toString());
    expect(await sugarYVault.shareBalances(whale.address)).to.equal(await convertToShares(ammount, vault));

    expect(shares.eq(await convertToShares(ammount, vault))).to.be.true;
    expect(await vault.balanceOf(sugarYVault.address)).to.equal(await convertToShares(ammount, vault));

    expect(await want.balanceOf(whale.address)).to.equal(0);
  });

 
});
