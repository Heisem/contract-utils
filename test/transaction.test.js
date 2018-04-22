const chai = require('chai');
const { expect, spy, should } = chai;
const spies = require('chai-spies');
const promised = require('chai-as-promised');
const contracts = require('./contracts');

chai.use(spies);
chai.use(promised);
const { Transaction } = require('../index');

describe('Transaction', () => {
  let transaction;

  beforeEach(() => {
    transaction = new Transaction(undefined, contracts);
  });

  it('should be an object instance', () => {
    expect(transaction).to.be.a('object');
  });

  it('should throw when called as a function', () => {
    expect(Transaction).to.throw();
  });

  describe('Transaction.createContract()', () => {
    it('should return a custom contract object', () => {
      const mySpy = chai.spy.on(transaction.eth, 'Contract');
      const { address, abi } = contracts['erc20'];
      const contract = transaction.createContract('erc20');
      expect(contract.address).to.equal(address);
      expect(contract.contractName).to.equal('erc20');
      expect(contract.contract).to.be.a('object');
      expect(mySpy).to.have.been.called();
      expect(mySpy).to.have.been.called.once;
      expect(mySpy).to.have.been.called.with(abi, address);
    });
  });

  describe('Transaction.create()', () => {
    it('should create a raw transaction', (done) => {
      (async () => {
        transaction.eth.getTransactionCount = async (address) => {
          return Promise.resolve(1);
        }
        transaction.eth.getGasPrice = async () => { 
          return Promise.resolve(0);
        }
        const spyGetTransactionCount = chai.spy.on(transaction.eth, 'getTransactionCount');
        const spyGetGasPrice = chai.spy.on(transaction.eth, 'getGasPrice');
        const contract = transaction.createContract('erc20');
        const spyContractMethods = chai.spy.on(contract.contract.methods['transfer'], 'apply');
        const rawTransaction = await transaction.create(
          contract,
          undefined,
          undefined,
          'transfer',
          '0xbEF31a35048dec439dF293bB5Bd9f6c35BcF32a3',
          [
            '0xD842Cf213EAcF7E907425dfb70a379EBc98725e3',
            1000000000000000000
          ]
        );
        expect(spyGetTransactionCount).to.have.been.called.with('0xbEF31a35048dec439dF293bB5Bd9f6c35BcF32a3');
        expect(spyGetTransactionCount).to.have.been.called.once;
        expect(spyGetGasPrice).to.have.been.called.once;
        expect(spyContractMethods).to.have.been.called.with(
          transaction,           [
          '0xD842Cf213EAcF7E907425dfb70a379EBc98725e3',
          1000000000000000000
        ]);
        done();
      })();
    });
  });
});