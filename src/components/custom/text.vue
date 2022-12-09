<template>
  <custom-share-wrapper :event="config.event">
    <div :style="[getStyle(config.style)]"
      @click="handleClick(config)">
      {{ config.text }}
    </div>
  </custom-share-wrapper>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomText extends Mixins(CustomComponent) {
    @Prop(Object) config
  }
</script>

<style lang='scss' scoped>
</style>
