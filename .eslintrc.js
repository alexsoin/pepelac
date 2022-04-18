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
	rules: {
		quotes: [2, "double", { avoidEscape: true }],
		indent: ["error", "tab"],
		"no-multi-assign": ["error", { ignoreNonDeclaration: true }],
		"no-return-assign": 0,
		"no-param-reassign": ["error", { props: false }],
		"consistent-return": 0,
		"func-names": ["error", "never"],
		"max-len": ["error", { code: 300 }],
		"no-console": "off",
		"no-tabs": 0,
	},
};
