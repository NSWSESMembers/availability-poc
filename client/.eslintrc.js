module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/require-default-props": [0],
    "react/no-unused-prop-types": [2, {
      "skipShapeProps": true
    }],
    "react/no-multi-comp": [0],
    "function-paren-newline": ["error", "consistent"],
    "object-curly-newline": ["error", {
      "multiline": true,
      "consistent": true,
    }],
  },
  "env": {
    "jest": true
  }
};
