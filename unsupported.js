const platformName = require('platform-name');

module.exports = async () => {
  const error = new Error(`get-chrome-tabs only supports macOS, but the current platform is ${
    platformName()
  }.`);

  error.code = 'ERR_UNSUPPORTED_PLATFORM';
  throw error;
};
