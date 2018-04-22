# contract-utils
Contract utility library for Ethereum, to easily sign and send raw transactions

[![npm version](https://badge.fury.io/js/contract-utils.svg)](https://badge.fury.io/js/contract-utils) [![Build Status](https://travis-ci.org/Heisem/contract-utils.svg?branch=master)](https://travis-ci.org/Heisem/contract-utils) [![dependencies Status](https://david-dm.org/heisem/contract-utils/status.svg)](https://david-dm.org/heisem/contract-utils) [![devDependencies Status](https://david-dm.org/heisem/contract-utils/dev-status.svg)](https://david-dm.org/heisem/contract-utils?type=dev) [![Coverage Status](https://coveralls.io/repos/github/Heisem/contract-utils/badge.svg?branch=master)](https://coveralls.io/github/Heisem/contract-utils?branch=master)

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
  value: 0, // optional value sent in ether (wei) if function is 'payable' (default: 0)
}
Transaction.send(
  txData,
  'transfer', // method to be called in the contract
  '0x...', // @param1
  1000000000000000000, // @param2
  // ...other params
)
.then(console.log);
```