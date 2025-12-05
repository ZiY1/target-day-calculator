module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
    },
    settings: {
        react: { version: "detect" },
    },
    plugins: ["@typescript-eslint", "react", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "google",
        "plugin:prettier/recommended",
    ],
    rules: {
        "prettier/prettier": "error",
        "require-jsdoc": "off", // Google requires JSDoc, but annoying for React
        "react/react-in-jsx-scope": "off",
        "quotes": ["error", "double"],
        "indent": ["error", 2],
    },
};
