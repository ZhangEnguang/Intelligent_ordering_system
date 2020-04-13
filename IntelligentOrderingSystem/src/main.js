// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Iorder from './Iorder'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Axios from "axios";
import Echarts from "echarts"
import cookies from "vue-cookies"
Vue.use(ElementUI)
Vue.use(cookies)
Vue.prototype.$axios = Axios
Vue.prototype.$echarts = Echarts
Axios.defaults.baseURL = '/api'
Axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.config.productionTip = false
//定义eventBus进行数据交互
window.eventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(Iorder),
  components: { Iorder },
  template: '<Iorder/>'
})
