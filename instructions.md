ou can deploy in the localhost network following these steps:

### Start a local node
1) `npx hardhat node`
- Open a new terminal and deploy the smart contract in the localhost network

### TypeScript / JavaScript
2) `npx hardhat run --network localhost scripts/deploy.ts`
As general rule, you can target any network from your Hardhat config using:

npx hardhat run --network <your-network> scripts/deploy.js