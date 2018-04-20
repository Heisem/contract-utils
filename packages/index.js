const { version } = require('../package.json');

module.exports = {
  version,
  Transaction: require('./transaction'),
};
