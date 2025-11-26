export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    'import-notation': null,
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['theme', 'source', 'utility', 'variant', 'custom-variant', 'plugin'] },
    ],
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'function-no-unknown': [true, { ignoreFunctions: ['theme'] }],
    'no-invalid-position-declaration': null,
  },
};
