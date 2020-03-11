module.exports = {
	extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {},
		},
	},
	rules: {
		'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
		'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],
		'@typescript-eslint/indent': [2, 4],
		'import/extensions': [2, {ignorePackages: true}],
		quotes: [2, 'single'],
		"comma-dangle": [2, 'never'],
		indent: [2, 4],
		'no-param-reassign': [0],
		"max-len": [2, {
			code: 150,
			comments: 150,
			ignoreUrls: true
		}],
		'react/jsx-props-no-spreading': [2, {
			html: 'enforce',
			custom: 'ignore',
			exceptions: []
		}]
	},
};
