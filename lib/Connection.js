// Default Connection Interface
class Connection {
  /**
   * Create ContractUtils
   * @param {object} web3 web3 instance
   * @param {object} contracts example: { 'erc20': { address: '', abi: [] } }
   */
  constructor(web3, contracts) {
    this.web3 = web3;
    this.contracts = contracts;
  }

  getWeb3() {
    return this.web3;
  }

  getContracts() {
    return this.contracts;
  }

}

module.exports = Connection;
