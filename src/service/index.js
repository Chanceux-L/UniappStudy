import { Component, Vue } from 'vue-property-decorator';
import _ from 'lodash';

@Component
export class Service extends Vue {
  pageListeners = new Map

  subscribe(name, handle, autoClear = true) {
    name = this.buildEventName(name);
    this.$on(name, handle);
    const clear = () => {
      this.$off(name, handle);
    };
    if (autoClear) {
      const page = this.$nav.currentPage;
      if (!this.pageListeners.has(page)) {
        this.pageListeners.set(page, []);
      }
      this.pageListeners.get(page).push(clear);
    }
    return clear;
  }

  clearListenersByPage(page) {
    _.forEach(this.pageListeners.get(page), clear => clear());
  }

  buildEventName(name) {
    if (typeof name === 'string') {
      return _.kebabCase(name);
    } else if (_.isObject(name)) {
      const { event, model } = name;
      return `${_.kebabCase(event)}:${model.tn}:${model.id}`;
    }
  }

  dispatchEvent(name, ...args) {
    this.$emit(this.buildEventName(name), ...args);
  }
}

export const service = new Service;

Vue.mixin({
  onUnload() {
    service.clearListenersByPage(this);
  }
});
