# contract-utils
Contract utility library for Ethereum, to easily sign and send raw transactions using web3

#### How to use:
```sh
const web3 = require('web3');
const ContractUtils = require('contract-utils');
const contracts = {
  'erc20': { // contract name
    address: '', // contract address
    abi: [], // contract abi
  },
};
const contractUtils = new ContractUtils(web3, contracts);

// Example signing and sending transaction to a custom ERC20 contract
contractUtils.sendTransaction(
  'erc20', // contract name from 'contacts' object
  'privateKey', // private key to sign the transaction
  'transfer', // method to be called in the contract
  'address', // param from 'transfer' function
  web3.utils.toWei(String(1), 'ether'), // param from 'transfer' function
  // ...other params
)
.then(console.log);
```