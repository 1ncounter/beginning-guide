import Vue from 'vue';
import App from './App.vue';
import { BeginnerGuidePlugin } from '../index';

Vue.config.productionTip = false;

Vue.use(BeginnerGuidePlugin);

new Vue({
  render: h => h(App)
}).$mount('#app');
