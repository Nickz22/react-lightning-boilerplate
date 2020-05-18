module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser

  parserOptions: {
    project: './tsconfig.json', // By default, ESLint doesn't read any project configuration from a tsconfig.json, you need to specify the path
    tsconfigRootDir: './',
    ecmaVersion: 2020,
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },

  // makes globals by library okie doke
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },

  // this is merely to use plugins and its rules
  // The eslint-plugin- prefix can be omitted for non-scoped packages
  // plugins: ['react', '@typescript-eslint', 'jest', 'prettier'],

  /*
   actually using the plugins... technically you dont have to apply extends but just set all the rules for the given plugin manually
   -> eslint-plugin-foo → foo/a-rule
   -> @foo/eslint-plugin → @foo/a-config
   -> @foo/eslint-plugin-bar → @foo/bar/a-environment
  */
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:jest/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier and should come after plugin.prettier
    'prettier/react', // Make sure to put it last, so it gets the chance to override other configs.
  ],

  rules: {
    // "off" or 0 - turn the rule off
    'camelcase': 0,
    'operator-linebreak': 0,
    '@typescript-eslint/no-parameter-properties': 0, // Discourages the pattern of defining injectable properties inside the constructor that NestJS relies on.
    '@typescript-eslint/no-unused-vars': 0, // https://github.com/typescript-eslint/typescript-eslint/pull/233
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    // "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
    'no-console': 1,
    // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
    'no-var': 2,
    'prefer-const': 2,
    'object-curly-spacing': [2, 'always'],
    'object-shorthand': [2, 'always'],
    'prettier/prettier': 2,
    'jest/prefer-to-be-null': 2,
    'jest/prefer-to-be-undefined': 2,
    '@typescript-eslint/explicit-member-accessibility': [2, {'accessibility': 'no-public'}], // disables explicit public definitions
  },

  settings: {
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  },

  // extra nice stuff
  reportUnusedDisableDirectives: true,
  ignorePatterns: ["node_modules", "package.json"],
}
