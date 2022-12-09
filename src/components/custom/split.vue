<template>
  <custom-share-wrapper :event="config.event">
    <div :style="[getStyle(config.style.container)]">
      <div class='custom-split' :style="[borderStyle]" @click="handleClick(config)"></div>
    </div>
  </custom-share-wrapper>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomSplit extends Mixins(CustomComponent) {
    @Prop(Object) config

    get borderStyle() {
      const { style } = this.config;
      return {
        borderTopStyle: style.border.borderStyle,
        ...this.getStyle(style.border)
      };
    }
  }
</script>

<style lang='scss' scoped>
</style>
