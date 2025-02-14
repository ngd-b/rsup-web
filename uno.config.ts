import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
      primary: "#409EFF",
      info: "#909399",
      success: "#67C23A",
      warning: "#E6A23C",
      error: "#F56C6C",
    },
  },
  rules: [
    [
      "animate-rotate-360",
      {
        "animation-name": "rotate-360",
      },
    ],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
    presetRemToPx({
      baseFontSize: 4,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
