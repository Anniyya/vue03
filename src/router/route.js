import VueRouter from "vue-router";
import Vue from "vue";
import dish from "@/components/dish.vue";
import manager from "@/components/manager.vue";
import category from "@/components/category.vue";
import customer from "@/components/customer.vue";
import statistics from "@/components/statistics.vue";
import check from "@/components/check.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/dish", component: dish },
    { path: "/category", component: category },
    { path: "/customer", component: customer },
    { path: "/statistics", component: statistics },
    { path: "/check", component: check },
    // { path: "/", component: manager },
  ],
});

export default router;
