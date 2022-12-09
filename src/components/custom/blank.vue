<template>
  <custom-share-wrapper :event="config.event">
    <div :style="[getStyle(config.style)]" @click="handleClick(config)">
    </div>
  </custom-share-wrapper>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomBlank extends Mixins(CustomComponent) {
    @Prop(Object) config
  }
</script>
