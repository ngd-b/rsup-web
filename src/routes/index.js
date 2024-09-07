import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/:is_dev/:name/readme",
    name: "readme",
    props: true,
    component: () => import("@/views/home/readme.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
