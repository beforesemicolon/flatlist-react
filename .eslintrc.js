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
		'import/extensions': [2, {ignorePackages: true}],
		'no-nested-ternary': [0],
		indent: [2, 4, { "SwitchCase": 1 }],
		"arrow-body-style": [1, 'as-needed'],
		'@typescript-eslint/indent': [2, 4],
		'react/jsx-indent': [2, 4],
		'react/sort-comp': [0],
		"react/destructuring-assignment": [1, "always", { "ignoreClassFields": true }],
		'react/static-property-placement': [1, 'property assignment', {
			propTypes: "static public field",
			defaultProps: "static public field"
		}],
		'react/state-in-constructor': [0],
		'react/jsx-indent-props': [2, 4],
		"object-curly-newline": [0],
		"object-curly-spacing": [0],
		quotes: [2, 'single'],
		"comma-dangle": [2, 'never'],
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
