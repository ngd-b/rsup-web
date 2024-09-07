import { createApp } from "vue";
// app
import App from "./App.vue";
import "./base.less";
import "@unocss/reset/normalize.css";
import "virtual:uno.css";
import routes from "./routes";
import { createPinia } from "pinia";
import Components from "@/components/index.js";

const app = createApp(App);

// 注册全局组件
app.use(Components);
//
app.use(routes);
const pinia = createPinia();
app.use(pinia);

app.mount("#app");
