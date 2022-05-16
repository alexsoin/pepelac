module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"airbnb-base",
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	ignorePatterns: ["gulpfile.babel.js", "dist/**/*", "node_modules/**/*"],
	rules: {
		quotes: [2, "double", { avoidEscape: true }],
		indent: ["error", "tab"],
		camelcase: 0,
		"import/extensions": ["error", "always"],
		"import/no-extraneous-dependencies": 0,
		"no-underscore-dangle": 0,
		"no-plusplus": 0,
		"no-continue": 0,
		"no-multi-assign": ["error", { ignoreNonDeclaration: true }],
		"no-return-assign": 0,
		"no-param-reassign": ["error", { props: false }],
		"class-methods-use-this": 0,
		"consistent-return": 0,
		"func-names": ["error", "never"],
		"max-len": ["error", { code: 900 }],
		"no-console": "off",
		"no-tabs": 0,
	},
};
