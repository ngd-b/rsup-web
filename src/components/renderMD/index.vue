<template>
  <div v-html="content"></div>
</template>
<script setup>
import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";
// import "shiki/themes/vitesse-dark.mjs";
// import "shiki/themes/vitesse-light.mjs";

defineOptions({
  name: "render-md",
});
// markdown-it init
const md = MarkdownIt();
// const md = MarkdownIt({
//   // Enable HTML tags in source
//   html: false,

//   // Use '/' to close single tags (<br />).
//   // This is only for full CommonMark compatibility.
//   xhtmlOut: false,

//   // Convert '\n' in paragraphs into <br>
//   breaks: false,

//   // CSS language prefix for fenced blocks. Can be
//   // useful for external highlighters.
//   langPrefix: "language-",

//   // Autoconvert URL-like text to links
//   linkify: false,

//   // Enable some language-neutral replacement + quotes beautification
//   // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
//   typographer: false,

//   // Double + single quotes replacement pairs, when typographer enabled,
//   // and smartquotes on. Could be either a String or an Array.
//   //
//   // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
//   // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
//   quotes: "“”‘’",

//   // Highlighter function. Should return escaped HTML,
//   // or '' if the source string is not changed and should be escaped externally.
//   // If result starts with <pre... internal wrapper is skipped.
//   highlight: function (/*str, lang*/) {
//     return "";
//   },
// });
// md.use(
//   await Shiki({
//     themes: {
//       light: "vitesse-light",
//       dark: "vitesse-dark",
//     },
//   })
// );

const props = defineProps({
  data: String,
});

let content = ref("");
watch(
  () => props.data,
  () => {
    console.log(props.data);
    const html = md.render(props.data);

    content.value = html;
  },
  {
    immediate: true,
  }
);
</script>
