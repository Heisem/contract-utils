const web3 = require('web3');

const { version } = require('../package.json');

// Default Connection Interface
class Connection {
  /**
   * Create ContractUtils
   * @param {object} web3 web3 instance
   * @param {object} contracts example: { 'erc20': { address: '', abi: [] } }
   */
  constructor(providerUrl, contracts) {
    const web3client = new web3();
    const provider = new web3.providers.HttpProvider(providerUrl);
    web3client.setProvider(provider);
    this.web3 = web3client;
    this.contracts = contracts;
  }

  getWeb3() {
    return this.web3;
  }

  getContracts() {
    return this.contracts;
  }

  get version() {
    return version;
  }

}

module.exports = Connection;
