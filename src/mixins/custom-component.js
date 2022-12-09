import { Vue, Component } from 'vue-property-decorator';
import { getStyle } from '@/utils';

@Component
export default class CustomComponent extends Vue {
  getStyle(config) {
    return getStyle(config);
  }

  $previewImage(images) {
    if (!Array.isArray(images) || !images.length) {
      return;
    }
    uni.previewImage({
      current: 0,
      urls: images
    });
  }

  handleClick({ event, image }) {
    let pageId = '';
    if (this.config) {
      pageId = this.config.pageId;
    }
    if (!event) {
      return;
    }
    switch (event.name) {
      case 'link':
        switch (event.navType) {
          case 'mp_link':
            this.$nav.nav(event.link);
            break;
          case 'web_link':
            this.$nav.nav(event.web_link);
            break;
          case 'external_mp_link':
            uni.navigateToMiniProgram({ appId: event.appid, path: event.external_mp_link });
            break;
        }
        break;
      case 'tel':
        uni.makePhoneCall({
          phoneNumber: event.tel,
          success: () => {},
          fail: () => {}
        });
        break;
      case 'address':
        uni.openLocation({
          longitude: +event.longitude,
          latitude: +event.latitude,
          name: event.address
        });
        break;
      case 'poster':
        this.$service.createPoster({ pageId });
        break;
      case 'popup':
        this.$service.createDialog({ pageId, popup: event.popup });
        break;
      case 'image-preview':
        this.$previewImage([image]);
        break;
    }
  }
}
