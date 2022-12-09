<template>
  <swiper
    :indicator-dots="config.indicatorDots"
    :indicator-color="config.indicatorColor"
    :indicator-active-color="config.indicatorActiveColor"
    :autoplay="config.autoplay"
    :interval="config.interval * 1000"
    :duration="config.duration * 1000"
    :circular="config.circular"
    :style="[getStyle(config.style)]">
    <swiper-item
      v-for="(item, index) in config.items"
      :key="index"
      @click="handleClick(item)">
      <custom-share-wrapper :event="item.event">
        <div class='content flex item-center'>
          <image
            class="image"
            mode="widthFix"
            :src="item.image"
          />
          <div class='text-box' v-if="item.text" :style="[getStyle(config.style.textContainer)]">
            <text :style="[getStyle(config.style.text)]">{{ item.text }}</text>
          </div>
        </div>
      </custom-share-wrapper>
      </swiper-item>
  </swiper>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomSwiper extends Mixins(CustomComponent) {
    @Prop(Object) config
  }
</script>

<style lang='scss' scoped>
  .content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .image {
    width: 100%;
    height: 100%;
  }

  .text-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
