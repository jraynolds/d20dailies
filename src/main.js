import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import { firebase, db } from './plugins/firebase'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
	store,
	firebase,
	db,
  render: h => h(App)
}).$mount('#app')
