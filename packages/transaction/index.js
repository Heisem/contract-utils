const ethereumTx = require('ethereumjs-tx');
const Web3 = require('web3');

// Contract Utility Library
class Transaction extends Web3 {
  /**
   * Create ContractUtils
   * @param {string} providerUrl provider url
   * @param {object} contracts example: { 'erc20': { address: '', abi: [] } }
   */
  constructor(providerUrl, contracts) {
    super(providerUrl);
    this.contracts = contracts;
  }

  /**
   * Create a Custom Contract Object
   * @param {string} contractName
   * @returns {object} contract
   */
  createContract(contractName) {
    const contract = this.contracts[contractName];
    const { abi, address } = contract;
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
  async create(contract, gasLimit = 200000, value = 0, method, fromAddress, params) {
    const nonce = await this.eth.getTransactionCount(fromAddress);
    const gasPriceGwei = await this.eth.getGasPrice();
    return {
      from: fromAddress,
      nonce: this.utils.toHex(nonce),
      gasPrice: Number(gasPriceGwei),
      gasLimit: this.utils.toHex(gasLimit),
      to: contract.address,
      value: this.utils.toHex(value),
      data: contract.contract.methods[method](...Object.values(params)).encodeABI(),
      // chainId: chainId,
    };
  };

  /**
   * Sign a Raw Transaction
   * @param {string} privateKey 
   * @param {object} rawTransaction
   * @returns {object} signedTransaction
   */
  sign(privateKey, rawTransaction) {
    const key = new Buffer(privateKey, 'hex');
    const tx = new ethereumTx(rawTransaction);
    tx.sign(key);
    const serializedTx = tx.serialize();
    return `0x${serializedTx.toString('hex')}`;
  }

  /**
   * Send Raw Transsaction
   * @param {string} contractName // contract name defined in './contract/index'
   * @param {string} method // contract function to be called
   * @param {string} privateKey // private key
   * @param {object} params // params as defined in the contract function
   * @returns {object} receipt from transaction
   */
  async send({ contractName, privateKey, gasLimit, value }, method, ...params) {
    const contract = this.createContract(contractName);
    const account = this.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
    const fromAddress = account.address;
    const rawTransaction = await this.create(contract, gasLimit, value, method, fromAddress, params);
    const signedTransaction = this.sign(privateKey, rawTransaction);
    const receipt = await this.eth.sendSignedTransaction(signedTransaction);
    return receipt;
  };
}

module.exports = Transaction;