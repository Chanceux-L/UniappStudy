<template>
  <div class="container">
    <image
      :src="config.image"
      mode="widthFix"
      class="image"
      @click="handleImageClick"
    >
    <template v-for="(item, index) in areas">
      <custom-share-wrapper
        class="item-area"
        :style="[item.style]"
        :event="item.event"
        :key="index"
      >
        <div
          :data-index="index"
          class="item-area-trigger"
          @click="handleClick(item, $event)"
        />
      </custom-share-wrapper>
    </template>
  </div>
</template>

<script>
  import { Component, Prop, Mixins } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';
  import _ from 'lodash';

  @Component
  export default class CustomImageArea extends Mixins(CustomComponent) {
    @Prop(Object) config;

    get areas() {
      const containerWidth = _.get(this.config, 'containerWidth');
      const areas = _.get(this.config, 'areas') || [];
      const ratio = 375 / containerWidth;
      return areas.map(item => {
        const body = {
          ...item,
          width: ratio * item.width,
          height: ratio * item.height,
          left: ratio * item.left,
          top: ratio * item.top
        };
        body.style = this.getStyle(body);
        return body;
      });
    }

    handleImageClick() {
      const { _autoPreview, areas, image } = this.config;
      if (_autoPreview) {
        if (!areas || !areas.length) {
          this.handleClick({ image, event: { name: 'image-preview' } });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
  }

  .image {
    width: 100%;
  }

  .item-area {
    position: absolute;

    .item-area-trigger {
      width: 100%;
      height: 100%;
    }
  }
</style>
