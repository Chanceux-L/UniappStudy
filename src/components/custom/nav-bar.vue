<template>
  <div class="custom-nav-bar flex">
    <custom-share-wrapper v-for="(item, index) in config.items"
      :key="index"
      :event="item.event"
      class="flex-1">
      <div class="content flex wrap content-center"
        @click="handleClick(item)"
        :style="[getStyle(config.style)]">
        <div v-if="item.text" class="text" :style="[getSelectedStyle(item)]">{{ item.text }}</div>
        <div class="line" :style="[{backgroundColor: config.style.selected.color}]" v-if="Number(config.type) === 2 && item.selected"></div>
      </div>
    </custom-share-wrapper>
  </div>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomNavBar extends Mixins(CustomComponent) {
    @Prop(Object) config

    getSelectedStyle({ selected }) {
      if (!selected) {
        return;
      }
      return this.config.style.selected;
    }
  }
</script>

<style lang='scss' scoped>
  .content {
    position: relative;

    .line {
      position: absolute;
      bottom: 2px;
      left: 50%;
      width: 60%;
      height: 2px;
      transform: translateX(-50%);
    }
  }
</style>
