// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = hre.ethers.parseEther("0.001");

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );

  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const nft = await NFTFactory.deploy(
    "Torso #1", // Name
    "TRS1", // Symbol
    "https://image-uri.com", //
    "1056x398",
    1928, // Year
    "Kazemir Malevitch",
    "Postsuprematism"
  );
  await nft.waitForDeployment();
  const addressNFT = await nft.getAddress();

  const token = await TokenFactory.deploy(
    "Torso #1(ERC-20)",
    "TRS1th",
    addressNFT,
    10000
  )
  
  await token.waitForDeployment();
  const addressToken = await token.getAddress();

  console.log(`NFT Deployed to: ${addressNFT}`)
  console.log(`Address of Token Contract: ${addressToken}`)
  // console.log(`Address of Deployer: ${deployer}\n`)
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
