<template>
  <custom-share-wrapper :event="config.event">
    <div :style="[getStyle(config.style.container)]">
      <image :src="config.image"
        mode="widthFix"
        class="image"
        :style="[imageStyle]"
        @click="handleClick(config)"
        />
    </div>
  </custom-share-wrapper>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomImage extends Mixins(CustomComponent) {
    @Prop(Object) config

    get imageStyle() {
      const { image } = this.config.style;
      return Object.assign(this.getStyle(image), {
        width: Math.min(image.width, 100) + '%'
      });
    }
  }
</script>

<style lang='scss' scoped>
  .image {
    width: 100%;
    height: 100%;
  }
</style>
