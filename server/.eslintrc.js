module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "rules": {
    "function-paren-newline": [0],
    "object-curly-newline": ["error", {
      "multiline": true,
      "consistent": true,
    }],
  },
  "env": {
    "jest": true
  }
};
