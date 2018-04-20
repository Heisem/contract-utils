var version = require('../package.json').version;

module.exports = {
  version,
  Transaction: require('./transaction'),
};
