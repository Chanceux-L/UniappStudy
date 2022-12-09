import Vue from 'vue';
import qs from 'qs';
import { SHARE_COVER } from '@/constants';

Vue.mixin({
  onShareAppMessage() {
    return this.$mergeShareAppMessage();
  },

  onLoad({ scene, ...query }) {
    if (scene) {
      const obj = qs.parse(decodeURIComponent(scene));
      Object.assign(query, obj);
    }
    this.$query = query;
  },

  methods: {
    $mergeShareAppMessage(config = {}) {
      let { title, path, imageUrl } = config;

      if (/^http/.test(path)) {
        path = `/pages/extra/web-site?src=${encodeURIComponent(path)}`;
      } else if (!path) {
        path = '/pages/root/home';
      }

      if (!imageUrl) {
        imageUrl = SHARE_COVER;
      }

      return { title, path, imageUrl };
    },
  }
});
