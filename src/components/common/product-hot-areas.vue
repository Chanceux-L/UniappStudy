<template>
  <custom-components :components="customComponents" />
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import { randomString } from '@/utils';

const tryParseJson = (str, defaultResult = {}) => {
  let result = _.cloneDeep(defaultResult);
  try {
    result = JSON.parse(str);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return result;
};

@Component
export default class ProductHotAreas extends Vue {
  @Prop({ type: Array }) detailImageWithHotArea;
  @Prop({ type: Array, default: () => [] }) detailImages;

  uuid = randomString();

  get customComponents() {
    const hotArea = (this.detailImageWithHotArea && this.detailImageWithHotArea.length) ?
      this.detailImageWithHotArea.map(tryParseJson) :
      (this.detailImages || []).map(item => ({ image: item  }));
    // 转成自定义组件需要的格式
    return hotArea.map((item, index) => ({
      name: 'image-area',
      key: `product-image-area-${index}`,
      autoPreview: true,
      config: {
        ...item,
        pageId: this.uuid,
        // 兼容旧商品详情，没有设置热区时可以预览图片
        _autoPreview: true
      },
    }));
  }

  created() {
    this.$service.subscribe('createPoster', ({ pageId }) => {
      // 页面上同时有几个组件时防止触发多个事件
      if (pageId === this.uuid) {
        this.$emit('createPoster');
      }
    });
  }
}
</script>
