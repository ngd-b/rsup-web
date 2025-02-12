import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import unocss from "@unocss/eslint-config/flat";
import typescriptEslint from "typescript-eslint";
import vueEslintParser from "vue-eslint-parser";

export default typescriptEslint.config(
  {
    ignores: [".vite/**", "*.d.ts", "**/dist"],
  },
  {
    extends: [
      unocss,
      pluginJs.configs.recommended,
      ...pluginVue.configs["flat/essential"],
      eslintConfigPrettier,
      ...typescriptEslint.configs.recommended,
    ],
    files: ["**/*.{js,mjs,cjs,vue,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
      parser: vueEslintParser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
      "vue/multi-word-component-names": "off",
    },
  }
);
