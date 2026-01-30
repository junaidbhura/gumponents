const defaultConfig = require( '@wordpress/scripts/config/.eslintrc' );

module.exports = {
	...defaultConfig,
	rules: {
		...defaultConfig.rules,
		'no-shadow': 'off',
		'@wordpress/no-base-control-with-label-without-id': 'off',
	},
};
