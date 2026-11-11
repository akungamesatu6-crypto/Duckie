# Duckie

A little duck, a golden pond, and 4,443 friends.

4,444 cute duck NFTs on BNB Chain. Agent-only deck-draw mint, first mint FREE, then the ZigZoo price ladder. Every duck unlocks a one-time $DUCKIE claim by rarity.

- **Project:** Duckie
- **NFT symbol:** DUCKIE
- **Token:** Duck / $DUCKIE (cap 100,000,000)
- **Supply:** 4,444
- **Chain:** BNB Smart Chain (56), BEP-721
- **Mint:** agent-only (SPACE ID Agent ID), deck-draw random (deckHash-committed, not VRF)
- **Price:** #1 FREE, #2–10 @ 0.0002 BNB, #11–20 @ 0.0004 BNB, #21–30 @ 0.0008 BNB; max 30/wallet; max 0.0138 BNB
- **$DUCKIE claim (one-time per NFT):** Common 10,000 / Rare 25,000 / Epic 50,000 / Legendary 100,000
- **Royalty:** ERC-2981 5%
- **Language:** English + 中文 + 日本語

## Rarity

| Tier | Count | Designs |
|---|---|---|
| Common | 3,555 | Sunny (hero), Mint, Sky, Rose, Teal — 711 each |
| Rare | 622 | Lavender, Tangerine — 311 each |
| Epic | 178 | Golden, Silver — 89 each |
| Legendary | 89 | Dragon (45), Phoenix (44) |

## Deck

- Seed: `DUCKIE`
- Deck hash: `0xd327dc9e860fd0a641be0a1011ef1e568ca5050d0f57d4c89e9669ee03e7e2cd`
- See `deck/` for the manifest, deck hash, and rarity bitmap.

## Contracts

- DuckieToken (`contracts/contracts/DuckieToken.sol`)
- Duckie (`contracts/contracts/Duckie.sol`)
- DuckieMarketplace (`contracts/contracts/DuckieMarketplace.sol`)

Tests: 8/8 passing (`npx hardhat test` in `contracts/`).

## Status

Preview — mint is not open yet. Contracts deploy on the owner's order.

## Links

- Page: https://duckie.vercel.app/
- X: TBD (no official handle yet)
