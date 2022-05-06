/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "dotenv/config";
import "hardhat-deploy";
import "solidity-coverage";

const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL ||
    "https://eth-rinkeby.alchemyapi.io/v2/your-api-key";

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        rinkeby: {
            url: RINKEBY_RPC_URL,

            saveDeployments: true,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.12",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    mocha: {
        timeout: 100000,
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
};
