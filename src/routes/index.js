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
  {
    path: "/:name/relation",
    name: "relation",
    props: true,
    component: () => import("@/views/relation/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
