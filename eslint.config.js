import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  importPlugin.flatConfigs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
    },
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/require-description": "warn",
      "jsdoc/tag-lines": ["warn", "never", { startLines: 1 }],
    },
  },
];
