const ethereumTx = require('ethereumjs-tx');

// Contract Utility Library
class ContractUtils {
  /**
   * Create ContractUtils
   * @param {object} web3 web3 instance
   * @param {object} contracts example: { 'erc20': { address: '', abi: [] } }
   */
  constructor(web3, contracts) {
    this.web3 = web3;
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
      contract: new this.web3.eth.Contract(abi, address),
    };
  };

  /**
   * Create a Raw Transaction Object
   * @param {contract} contract contract
   * @param {string} from from address
   * @param {object} params params as array
   * @returns {object} rawTx
   */
  async createRawTransaction(contract, method, fromAddress, params) {
    const nonce = await this.web3.eth.getTransactionCount(fromAddress);
    const gasPriceGwei = await this.web3.eth.getGasPrice();
    const gasLimit = 4500000;
    return {
      from: fromAddress,
      nonce: this.web3.utils.toHex(nonce),
      gasPrice: Number(gasPriceGwei),
      gasLimit: this.web3.utils.toHex(gasLimit),
      to: contract.address,
      value: this.web3.utils.toHex(0),
      data: contract.contract.methods[method](...params).encodeABI(),
      // chainId: chainId,
    };
  };

  /**
   * Sign a Raw Transaction
   * @param {string} privateKey 
   * @param {object} rawTransaction
   * @returns {object} signedTransaction
   */
  signTransaction(privateKey, rawTransaction) {
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
  async sendTransaction(contractName, privateKey, method, ...params) {
    const contract = this.createContract(contractName);
    const account = this.web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
    const fromAddress = account.address;
    const rawTransaction = await this.createRawTransaction(contract, method, fromAddress, params);
    const signedTransaction = this.signTransaction(privateKey, rawTransaction);
    const receipt = await this.web3.eth.sendSignedTransaction(signedTransaction);
    return receipt;
  };

  /**
   * Transfer ERC20 Tokens
   * @param {string} privateKey private key
   * @param {string} to to address
   * @param {number} amount token amount to transfer
   * @returns {promise} transaction
   */
  transfer(privateKey, to, amount) {
    return this.sendTransaction(
      'erc20',
      privateKey,
      'transfer',
      to,
      this.web3.utils.toWei(String(amount), 'ether')
    );
  }
}

module.exports = ContractUtils;
