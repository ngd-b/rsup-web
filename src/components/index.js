// 渲染markdown
import RenderMD from "./renderMD/index.vue";
// 公共组件
import Dialog from "./dialog/index.vue";
import Select from "./select/index.vue";
import Copy from "./copy/index.vue";

const components = [RenderMD, Dialog, Select, Copy];
export default {
  install(app) {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};
