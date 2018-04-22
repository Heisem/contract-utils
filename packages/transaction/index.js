var ethereumTx = require('ethereumjs-tx');
var Web3 = require('web3');

/**
 * Create ContractUtils
 * @param {string} providerUrl provider url
 * @param {object} contracts example: { 'erc20': { address: '', abi: [] } }
 */
var Transaction = function (providerUrl, contracts) {
  if (!new.target) throw 'Transaction() must be called with new';
  Web3.call(this, providerUrl);
  this.contracts = contracts; 
}

Transaction.prototype = Object.create(Web3.prototype);
Transaction.prototype.constructor = Transaction;

/**
 * Create a Custom Contract Object
 * @param {string} contractName
 * @returns {object} contract
 */
Transaction.prototype.createContract = function createContract(contractName) {
  var contract = this.contracts[contractName];
  var { abi, address } = contract;
  return {
    contractName,
    address,
    contract: new this.eth.Contract(abi, address),
  };
};

/**
 * Create a Raw Transaction Object
 * @param {contract} contract contract
 * @param {string} from from address
 * @param {object} params params as array
 * @returns {object} rawTx
 */
Transaction.prototype.create = function createTransaction(contract, gasLimit, value, method, fromAddress, params) {
    var nonce = 0;
    var gasLimit = gasLimit || 200000;
    var value = value || 0;
    var _this = this;
    return this.eth.getTransactionCount(fromAddress).then(function(nonceCount) {
      nonce = nonceCount;
      return _this.eth.getGasPrice();
    }).then(function(gasPriceGwei) {
      return {
        from: fromAddress,
        nonce: _this.utils.toHex(nonce),
        gasPrice: Number(gasPriceGwei),
        gasLimit: _this.utils.toHex(gasLimit),
        to: contract.address,
        value: _this.utils.toHex(value),
        data: contract.contract.methods[method].apply(_this, params).encodeABI(),
        // chainId: chainId,
      };
    });
  };

/**
 * Sign a Raw Transaction
 * @param {string} privateKey 
 * @param {object} rawTransaction
 * @returns {object} signedTransaction
 */
Transaction.prototype.sign = function signTransaction(privateKey, rawTransaction) {
  var key = new Buffer(privateKey, 'hex');
  var tx = new ethereumTx(rawTransaction);
  tx.sign(key);
  var serializedTx = tx.serialize();
  return '0x' + serializedTx.toString('hex');
}

/**
 * Send Raw Transsaction
 * @param {string} contractName // contract name defined in './contract/index'
 * @param {string} method // contract function to be called
 * @param {string} privateKey // private key
 * @param {object} params // params as defined in the contract function
 * @returns {object} receipt from transaction
 */
Transaction.prototype.send = function sendTransaction({ contractName, privateKey, gasLimit, value }, method) {
  var params = Array.prototype.slice.call(arguments);
  params = params.slice(2);
  var contract = this.createContract(contractName);
  var account = this.eth.accounts.privateKeyToAccount('0x' + privateKey);
  var fromAddress = account.address;
  var signedTransaction;
  var _this = this;
  return this.create(contract, gasLimit, value, method, fromAddress, params)
    .then(function(rawTransaction) {
      var signedTransaction = _this.sign(privateKey, rawTransaction);
      return _this.eth.sendSignedTransaction(signedTransaction);
    })
    .then(function(receipt) {
      return receipt;
    });
};

module.exports = Transaction;
