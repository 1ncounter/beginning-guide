import { VueConstructor } from 'vue';
import { BeginnerGuide } from './core';

export const BeginnerGuidePlugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$guide = new BeginnerGuide();
  }
};

export * from './core';
