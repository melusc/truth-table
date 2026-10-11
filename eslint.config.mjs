import config from '@lusc/eslint-config';

export default [
	...config,
	{
		rules: {
			'node-test/test-title': 'off',
		},
	},
];
