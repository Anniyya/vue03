import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/route';
import './assets/global.css'

// import axios from 'axios'
// axios.defaults.baseURL = "http://localhost:8077"
// //设置全局axios
// Vue.config.globalProperties.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI,{size:"small"});

new Vue({
  render: h => h(App),
  router:router
}).$mount('#app')
