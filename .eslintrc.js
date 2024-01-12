module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // Include the 'prettier' plugin in the 'extends' array
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
