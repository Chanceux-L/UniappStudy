<template>
  <div :style="[getStyle(config.style.container)]" class="flex">
    <div v-for="(item, index) in config.items"
      :key="index"
      class="flex-1 image-wrapper"
      :style="[getStyle(config.style.image)]">
      <custom-share-wrapper :event="item.event">
        <image :src="item.image" mode="widthFix" class="image" @click="handleClick(item)" />
      </custom-share-wrapper>
    </div>
  </div>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomImage extends Mixins(CustomComponent) {
    @Prop(Object) config
  }
</script>

<style lang='scss' scoped>
  .image {
    width: 100%;
    height: 100%;
  }

  .image-wrapper {
    &:last-child {
      margin-right: 0 !important;
    }
  }
</style>
