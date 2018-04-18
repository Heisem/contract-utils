# contract-utils
Contract utility library for Ethereum, to easily sign and send raw transactions

#### How to use:
```sh
const ContractUtils = require('contract-utils');
const contracts = {
  'erc20': { // contract name
    address: '', // contract address
    abi: [], // contract abi
  },
};
const contractUtils = new ContractUtils('http://localhost:8545', contracts);

// Example signing and sending transaction to a custom ERC20 contract
contractUtils.sendTransaction({
  constractName: 'erc20', // contract name from 'contracts' object
  privateKey: 'privateKey', // private key to sign the transaction
  gasLimit: 4500000, //   optional: (default: 0)
  value: 0, // optional value sent in ether if function is 'payable' (default: 0)
  method: 'transfer', // method to be called in the contract
  /**
   * @params in order as defined by the contract function
   */
  toAddress: '0x...', // @param1
  tokens: 1000000000000000000, // @param2
  // ...other params
})
.then(console.log);
```