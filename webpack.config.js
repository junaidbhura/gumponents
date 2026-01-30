const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = [
	{
		...defaultConfig,
		entry: './resources/index.ts',
	},
	{
		...defaultConfig,
		entry: './tests/e2e/plugins/gumponents-test-blocks/src/index.ts',
		output: {
			...defaultConfig.output,
			path: path.resolve(
				__dirname,
				'tests/e2e/plugins/gumponents-test-blocks/build'
			),
		},
	},
];
