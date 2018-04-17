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
```