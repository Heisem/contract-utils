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
  let rawTx;

  beforeEach(() => {
    transaction = new Transaction(undefined, contracts);
    transaction.eth.getTransactionCount = async (address) => Promise.resolve(1);
    transaction.eth.getGasPrice = async () => Promise.resolve(0);
    transaction.eth.sendSignedTransaction = async () => Promise.resolve({});
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
        rawTx = rawTransaction;
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

  describe('Transaction().sign', () => {
    it('should return a signed transaction', () => {
      const mockRawTx = {
        from: '0xbEF31a35048dec439dF293bB5Bd9f6c35BcF32a3',
        nonce: '0x1',
        gasPrice: 0,
        gasLimit: '0x30d40',
        to: '0x8a5e2a6343108babed07899510fb42297938d41f',
        value: '0x0',
        data: '0xa9059cbb000000000000000000000000d842cf213eacf7e907425dfb70a379ebc98725e30000000000000000000000000000000000000000000000000de0b6b3a7640000'
      };
      const signedTx = transaction.sign('e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1', rawTx);
      expect(signedTx).to.be.equal('0xf8a5018083030d40948a5e2a6343108babed07899510fb42297938d41f80b844a9059cbb000000000000000000000000d842cf213eacf7e907425dfb70a379ebc98725e30000000000000000000000000000000000000000000000000de0b6b3a76400001ca0aa112e38c9851c93b195f3f48f5baf299c4d5104e42c9a289327c3492dd4a631a059a4a2db6c7871192aa7368b44bb94d42bf19f3c421c1605e55740f904218e79');
      expect(rawTx).to.deep.equal(mockRawTx);
    });
  });

  describe('Transaction().send', () => {
    it('should send a transaction and return the receipt', (done) => {
      (async () => {
        const spySendSignedTransaction = chai.spy.on(transaction.eth, 'sendSignedTransaction');
        const spyCreateContract = chai.spy.on(transaction, 'createContract');
        const spyPrivateKeyToAccount = chai.spy.on(transaction.eth.accounts, 'privateKeyToAccount');
        const spyCreate = chai.spy.on(transaction, 'create');
        const txData = {
          contractName: 'erc20',
          privateKey: 'e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1',
          gasLimit: 200000,
          value: 0,
        };
        const receipt = await transaction.send(
          txData,
          'transfer', // method to be called in the contract
          '0xbEF31a35048dec439dF293bB5Bd9f6c35BcF32a3', // @param1
          1000000000000000000, // @param2
          // ...other params
        );
        done();
        expect(spySendSignedTransaction).to.have.been.called.once;
        expect(spyCreateContract).to.have.been.called.with('erc20');
        expect(spyPrivateKeyToAccount).to.have.been.called.with('0xe6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1');
        expect(receipt).to.be.a('object');
      })();
    });
  });
});