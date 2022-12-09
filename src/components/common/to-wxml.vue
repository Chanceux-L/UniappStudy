<template>
  <towxml :nodes="wxml" />
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';
import towxml from '@/static/components/towxml/index';
import TowxmlComponent from '@/static/components/towxml/towxml';
import _ from 'lodash';

@Component({
  components: {
    towxml: TowxmlComponent
  }
})
export default class AppTowxml extends Vue {
  @Prop(String) content;
  @Prop(Boolean) isMarkdown;

  get wxml() {
    return towxml(this.content, this.isMarkdown ? 'markdown' : 'html', {
      events: {
        tap(e) {
          const tag = _.get(e, 'currentTarget.dataset.data.tag');
          if (tag === 'navigator') {
            const href = _.get(e, 'currentTarget.dataset.data.attrs.href');
            if (href) {
              uni.setClipboardData({
                data: href,
                success: () => {
                  uni.showToast({ icon: 'success', title: '链接已复制' });
                }
              });
            }
            return;
          }
          if (tag === 'img') {
            const src = _.get(e, 'currentTarget.dataset.data.attrs.src') || _.get(e, 'currentTarget.dataset.data.attrs[data-src]');
            if (src && /^http/.test(src)) {
              uni.previewImage({
                current: src,
                urls: [src]
              });
            }
          }
        }
      }
    });
  }
}
</script>
