import Vue from 'vue';
import App from './App.vue';
import store from './store';
// declare global {
//   const uni: any
// }

Vue.config.productionTip = false;
// vuex
Vue.prototype.$store = store;

new App({
	store
}).$mount();
