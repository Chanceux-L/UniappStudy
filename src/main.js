import Vue from 'vue';
import App from './App';
import './filters';
import './mixins';
import './plugins';
import {
  request, nav, sleep, showToast, showLoading,
  autoLoading, autoLoadingDecorator, clickLockDecorator,
  pageRefresh, errToast, uploadFiles, saveFiles
} from './utils';
import { service } from './service';
import { Collection, authStore, settings } from './stores';

Vue.config.productionTip = false;
Vue.prototype.$sleep = sleep;
Vue.prototype.$request = request;
Vue.prototype.$showToast = showToast;
Vue.prototype.$showLoading = showLoading;
Vue.prototype.$autoLoading = autoLoading;
Vue.autoLoading = autoLoadingDecorator;
Vue.clickLock = clickLockDecorator;
Vue.pageRefresh = pageRefresh;
Vue.errToast = errToast;
Vue.prototype.$nav = nav;
Vue.prototype.$uploadFiles = uploadFiles;
Vue.prototype.$saveFiles = saveFiles;

Vue.prototype.$service = service;

Vue.prototype.$authStore = authStore;
Vue.prototype.$settings = settings;
Vue.prototype.$Collection = Collection;

App.mpType = 'app';

const app = new Vue({
  ...App
});

app.$mount();
