import { createApp } from "vue";
// app
import App from "./App.vue";
import "@unocss/reset/normalize.css";
import "virtual:uno.css";
import routes from "./routes";
import { createPinia } from "pinia";

const app = createApp(App);

//
app.use(routes);
const pinia = createPinia();
app.use(pinia);

app.mount("#app");
