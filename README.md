# contract-utils
Contract utility library for Ethereum, to easily sign and send raw transactions

[![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![dependencies Status][dep-image]][dep-url] [![devDependencies Status][dep-dev-image]][dep-dev-url] [![Coverage Status][coveralls-image]][coveralls-url]

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
};
Transaction.send(
  txData,
  'transfer', // method to be called in the contract
  '0x...', // @param1
  1000000000000000000, // @param2
  // ...other params
)
.then(console.log);
```

[npm-image]: https://badge.fury.io/js/contract-utils.svg
[npm-url]: https://badge.fury.io/js/contract-utils
[travis-image]: https://travis-ci.org/Heisem/contract-utils.svg?branch=master
[travis-url]: https://travis-ci.org/Heisem/contract-utils
[dep-image]: https://david-dm.org/heisem/contract-utils/status.svg
[dep-url]: https://david-dm.org/heisem/contract-utils
[dep-dev-image]: https://david-dm.org/heisem/contract-utils/dev-status.svg
[dep-dev-url]: https://david-dm.org/heisem/contract-utils?type=dev
[coveralls-image]: https://coveralls.io/repos/github/Heisem/contract-utils/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/Heisem/contract-utils?branch=master