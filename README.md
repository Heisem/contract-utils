# contract-utils
Web3 Smart Contracts Utility Library for Raw Transactions

#### How to use:
```sh
const web3 = require('web3');
const ContractUtils = require('contract-utils');
const contracts = {
  'erc20': {
    address: '',
    abi: [],
  },
};
const contractUtils = new ContractUtils(web3, contracts);
contractUtils.sendTransaction(
  'erc20', // contract name from contracts object
  'privateKey', // private key to sign the transaction
  'transfer' // method to be called in the contract,
  'toAddress', // address
  web3.utils.toWei(String(1), 'ether'), // params in the contract
  // ...other params
).then(console.log);
```