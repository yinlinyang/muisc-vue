// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import  'common/stylus/index.styl'

import fastClick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'

fastClick.attach(document.body)

Vue.use(vueLazyLoad, {
  loading: require('common/image/default.png')
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
