<template>
  <div :style="[getStyle(config.style)]">
    <video
      class="video"
      :src="config.video"
      :poster="config.poster"
      :controls="config.controls"
      :autoplay="config.autoplay"
      :loop="config.loop"
      :muted="config.muted"
      :object-fit="config.style.objectFit"
    />
  </div>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomVideo extends Mixins(CustomComponent) {
    @Prop(Object) config
  }
</script>

<style lang='scss' scoped>
  .video {
    width: 100%;
    height: 100%;
  }
</style>
