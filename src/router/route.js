import VueRouter from "vue-router";
import Vue from "vue";
import dish from "@/components/dish.vue";
import manager from "@/components/manager.vue";
import category from "@/components/category.vue";
import customer from "@/components/customer.vue";
import statistics from "@/components/statistics.vue";
import check from "@/components/check.vue";
import order from "@/components/order.vue";
import untreated from "@/components/untreated.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/dish", component: dish },
    { path: "/category", component: category },
    { path: "/customer", component: customer },
    { path: "/statistics", component: statistics },
    { path: "/check", component: check },
    { path: "/order", component: order },
    { path: "/untreated", component: untreated }
    // { path: "/", component: manager },
  ],
});

export default router;
