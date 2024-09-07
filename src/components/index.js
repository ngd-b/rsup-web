// 渲染markdown
import RenderMD from "./renderMD/index.vue";

const components = [RenderMD];
export default {
  install(app) {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};
