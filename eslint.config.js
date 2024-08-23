import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import unocss from "@unocss/eslint-config/flat";

export default [
  unocss,
  { files: ["**/*.{js,mjs,cjs,vue,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  eslintConfigPrettier,
  {
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
      "vue/multi-word-component-names": "off",
    },
  },
  {
    ignores: [".vite/**"],
  },
];
