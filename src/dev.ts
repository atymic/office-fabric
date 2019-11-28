import 'reflect-metadata'
import Vue, { CreateElement } from 'vue'
import VueRouter from 'vue-router'
import Preview from './Preview.vue'
import routes from '@/router/routes'

import Fabric from './plugins/office-fabric'

Vue.use(Fabric)

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
})

Vue.config.productionTip = false

new Vue({
  render: (h: CreateElement) => h(Preview),
  router,
}).$mount('#app')
