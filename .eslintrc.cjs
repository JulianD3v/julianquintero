/** @type {import("eslint-plugin-astro").ESLint.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:astro/recommended",
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    eqeqeq: ["error", "always", { null: "ignore" }],
    "prefer-const": "error",
    "object-shorthand": "warn",
    "no-var": "error",
  },
  overrides: [
    {
      // `env.d.ts` es el archivo que genera Astro con referencias triple-slash.
      files: ["*.d.ts"],
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    {
      files: ["*.mjs"],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    {
      files: ["scripts/**/*.mjs"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: [
    "dist/",
    "node_modules/",
    ".astro/",
    "public/",
    "*.config.js",
    "*.config.mjs",
    "*.config.cjs",
  ],
}
