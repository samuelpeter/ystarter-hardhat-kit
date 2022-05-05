import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { BaseStrategy, BaseStrategyInitializable, IERC20, IERC4626, IVault, SugarVault, VaultWrapper } from "typechain";
import { deployStrategy } from "./utils/deployStrategy";
import { deployVault } from "./utils/deployVault";
import { deployVaultWrapper } from "./utils/deployVaultWrapper";
import { deployYfi } from "./utils/deployYfi";

describe("Sugar vault Test", function () {
  let token: IERC20;
  let vault: IVault;
  let strategy: BaseStrategyInitializable;

  let vaultWrapper: IERC4626;

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
    strategy = await deployStrategy({ vault, keeper });
    vaultWrapper = await deployVaultWrapper(vault);

    await vault.addStrategy(strategy.address, BigNumber.from(10000), BigNumber.from(0), ethers.constants.MaxUint256, BigNumber.from(1000));
  });

  it("testSetupOk", async () => {
    const b = await token.balanceOf(whale.address);
  });
});
