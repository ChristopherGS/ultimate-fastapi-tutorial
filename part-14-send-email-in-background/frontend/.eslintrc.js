module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
    'eslint:recommended',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    "react/prop-types": "off"
  },
};
