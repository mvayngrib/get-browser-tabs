'use strict';

if (process.platform === 'darwin') {
	module.exports = require('./osx')

	/*
	const re = /(?<=___###___message___###___).*(?=___###___message___###___)/;

	module.exports = async function getChromeTabs(option) {
		const message = (await getStderr('osascript', [
			'-l',
			'JavaScript',
			require.resolve('./jxa.js'),
			'com.Google.Chrome.canary'
		])).match(re);

		try {
			return JSON.parse(message);
		} catch {
			throw new Error(message);
		}
	};
	*/
} else {
	module.exports = require('./unsupported')
}
