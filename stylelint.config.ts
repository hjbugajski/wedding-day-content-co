import type { Config } from 'stylelint';

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['custom-variant', 'plugin', 'source', 'theme', 'utility', 'variant'] },
    ],
    'function-no-unknown': [true, { ignoreFunctions: ['theme'] }],
    'import-notation': null,
    'nesting-selector-no-missing-scoping-root': [
      true,
      { ignoreAtRules: ['custom-variant', 'variant', 'utility'] },
    ],
    'no-invalid-position-declaration': null,
  },
} satisfies Config;
