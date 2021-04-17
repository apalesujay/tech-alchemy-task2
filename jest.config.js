const dotEnvConfigOptions = {
	path: `${__dirname}/.env.dev`
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config(dotEnvConfigOptions);

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true
};
