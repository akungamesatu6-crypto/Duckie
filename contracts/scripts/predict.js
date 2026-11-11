// Duckie CREATE2 predictions — mirrors the AgentRune deploy route.
// NO mainnet transaction: computes CREATE2 predicted addresses exactly as the
// deterministic-proxy route does (Arachnid proxy, salt 0), chained:
//   1. DuckieToken(owner)            -> predicted token address
//   2. Duckie(owner, revenue, registry, baseURI, deckHash, bitmap)
//   3. DuckieMarketplace(NFT)   -> predicted market address
// Run: npx hardhat run scripts/predict.js
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const BASE_URI = "https://duckie.vercel.app/metadata/";
const OWNER = "0x36F3D56eAD5D1D6C2434F94DeFcEF732C5C3CbD2"; // BAW (owner + revenue)
const PROXY = "0x4e59b44847b379578588920cA78FbF26c0B4956C"; // deterministic deployment proxy
const AGENT_ID = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F"; // SPACE ID Agent ID registry
const DECK_HASH = "0xd327dc9e860fd0a641be0a1011ef1e568ca5050d0f57d4c89e9669ee03e7e2cd";

function predict(artifact, types, values) {
  const args = ethers.AbiCoder.defaultAbiCoder().encode(types, values);
  const creation = artifact.bytecode + args.slice(2);
  const predicted = ethers.getCreate2Address(PROXY, ethers.ZeroHash, ethers.keccak256(creation));
  return { creation, predicted };
}

async function main() {
  const outDir = path.join(__dirname, "..");
  const bitmap = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "deck", "bitmap.json"), "utf-8"));
  if (bitmap.length !== 35) throw new Error("bitmap must have 35 words");

  const tokenArtifact = await hre.artifacts.readArtifact("DuckieToken");
  const nftArtifact = await hre.artifacts.readArtifact("Duckie");
  const marketArtifact = await hre.artifacts.readArtifact("DuckieMarketplace");

  const tokenPred = predict(tokenArtifact, ["address"], [OWNER]);
  const nftPred = predict(
    nftArtifact,
    ["address", "address", "address", "string", "bytes32", "uint256[35]"],
    [OWNER, OWNER, AGENT_ID, BASE_URI, DECK_HASH, bitmap]
  );
  const marketPred = predict(marketArtifact, ["address"], [nftPred.predicted]);

  const write = (name, pred) => {
    fs.writeFileSync(path.join(outDir, name + "_creation.txt"), pred.creation);
    fs.writeFileSync(path.join(outDir, name + "_inputdata.txt"), "0x" + "00".repeat(32) + pred.creation.slice(2));
    fs.writeFileSync(path.join(outDir, name + "_predicted.txt"), pred.predicted);
  };
  write("token", tokenPred);
  write("nft", nftPred);
  write("market", marketPred);

  const result = {
    project: "Duckie",
    chain: "BNB Smart Chain Mainnet (56)",
    baseURI: BASE_URI,
    owner: OWNER,
    revenueWallet: OWNER,
    agentIdRegistry: AGENT_ID,
    deckHash: DECK_HASH,
    deterministicProxy: PROXY,
    predicted: {
      snakeToken: tokenPred.predicted,
      projectNft: nftPred.predicted,
      marketplace: marketPred.predicted,
    },
    creationBytes: {
      snakeToken: (tokenPred.creation.length - 2) / 2,
      projectNft: (nftPred.creation.length - 2) / 2,
      marketplace: (marketPred.creation.length - 2) / 2,
    },
    note: "PREDICTED — NOT deployed, no mainnet transaction was sent. A CREATE2 prediction matching on-chain proves the constructor args exactly.",
  };
  fs.writeFileSync(path.join(outDir, "predictions.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
