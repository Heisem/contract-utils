# contract-utils
Contract utility library for Ethereum, to easily sign and send raw transactions

#### Installation:
  - `npm install contract-utils --save`

#### How to use:
```sh
const { Transaction } = require('contract-utils');
const contracts = {
  'erc20': { // contract name
    address: '', // contract address
    abi: [], // contract abi
  },
};
const Transaction = new Transaction('http://localhost:8545', contracts);

// Example signing and sending transaction to a custom ERC20 contract
const txData = {
  contractName: 'erc20', // contract name from 'contracts' object
  privateKey: 'privateKey', // private key to sign the transaction
  gasLimit: 200000, //   optional: (default: 200000)
  value: 0, // optional value sent in ether if function is 'payable' (default: 0)
}
contractUtils.sendTransaction(
  txData,
  'transfer', // method to be called in the contract
  // @params in order as defined by the contract function
  '0x...', // @param1
  1000000000000000000, // @param2
  // ...other params
)
.then(console.log);
```