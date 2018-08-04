const {inspect} = require('util');
const getStdout = require('execa').stdout;
const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const APP_ERROR = 'Expected `app` option to be either \'canary\' or \'chrome\'';
const chrome = 'com.google.Chrome';
const defaultBrowser = chrome;
const browsers = {
  canary: 'com.google.Chrome.canary',
  chrome: chrome,
  chromium: 'Chromium',
  opera: 'Opera',
  firefox: 'Firefox',
  safari: 'Safari',
  'safari-tech-preview': 'Safari Technology Preview',
}

exports = module.exports = async (...args) => {
  const argLen = args.length;
  const [option = {}] = args;

  if (argLen === 1) {
    if (!isPlainObj(option)) {
      throw new TypeError(`Expected an <Object> to specify get-chrome-tabs option, but got ${
        inspectWithKind(option)
      }.`);
    }

    if (option.app !== undefined) {
      if (typeof option.app !== 'string') {
        throw new TypeError(`${APP_ERROR}, but got a non-string value ${inspectWithKind(option.app)}.`);
      }

      if (!browsers[option.app]) {
        throw new RangeError(`${APP_ERROR}, but got neither of them ${inspect(option.app)}.`);
      }
    }
  } else if (argLen !== 0) {
    throw new RangeError(`Expected 0 or 1 argument ([<Object>]), but got ${argLen} arguments.`);
  }

  const id = browsers[option.app] || defaultBrowser;

  const stdout = await getStdout('osascript', [
    '-l',
    'JavaScript',
    require.resolve('./jxa.js'),
    id
  ])

  const result = JSON.parse(stdout);
  if (result.appNotRunning) {
    const error = new Error(result.message);
    error.code = 'ERR_APP_NOT_RUNNING';
    error.bundleId = id;

    throw error;
  }

  return result;
};

exports.browsers = browsers;
