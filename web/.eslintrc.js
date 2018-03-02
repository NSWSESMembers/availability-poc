module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/require-default-props': [0],
    'react/no-unused-prop-types': [
      2,
      {
        skipShapeProps: true,
      },
    ],
    'react/no-multi-comp': [0],
    'function-paren-newline': ['error', 'consistent'],
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        consistent: true,
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'import/no-named-as-default': 0,
  },
  env: {
    browser: true,
  },
};
