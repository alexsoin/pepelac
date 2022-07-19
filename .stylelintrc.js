module.exports = {
	overrides: [
		{
			files: ["src/assets/scss/**/*.scss"],
			customSyntax: "postcss-scss",
			extends: "stylelint-config-standard",
			plugins: [
				"stylelint-scss"
			],
			rules: {
				indentation: "tab",
				"value-keyword-case": ["lower", {
					ignoreKeywords: ["/^.*$/"],
					ignoreProperties: ["/^.*$/"],
					ignoreFunctions: ["/^.*$/"],
				}],
				"max-line-length": 360,
				"at-rule-no-unknown": null,
				"scss/at-rule-no-unknown": true,
				"no-duplicate-selectors": true,
				"color-hex-case": "lower",
				"selector-no-qualifying-type": true,
				"selector-combinator-space-after": "always",
				"selector-attribute-quotes": "always",
				"selector-attribute-brackets-space-inside": "never",
				"declaration-block-trailing-semicolon": "always",
				"declaration-colon-space-before": "never",
				"declaration-colon-space-after": "always",
				"number-leading-zero": "never",
				"function-url-quotes": "always",
				"font-family-name-quotes": "always-unless-keyword",
				"at-rule-no-vendor-prefix": true,
				"rule-empty-line-before": "always-multi-line",
				"selector-pseudo-element-colon-notation": "double",
				"selector-pseudo-class-parentheses-space-inside": "never",
				"media-feature-parentheses-space-inside": "never",
			}
		}
	]
};
