<template>
  <common-button-fixed-bottom v-if="show">
    <div class='tab-bar flex' :style="[getStyle(tabBar.config.style)]">
      <div v-for="(item, index) in tabBar.config.items"
        :key="index"
        class="item flex-1 flex content-center item-center"
        @click="handleClick(index)">
        <div class="content flex wrap content-center">
          <image class="image" v-if="item.iconPath" :src="getImagePath(item, index)" mode="widthFix" />
          <div class="text text-center" :style="[getTextStyle(index)]">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </common-button-fixed-bottom>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class TabBar extends Mixins(CustomComponent) {
    @Prop(Object) tabBar
    @Prop(Number) pageId

    get show() {
      return this.tabBar.pages.includes(+this.pageId);
    }

    getPageId(index) {
      return +this.tabBar.pages[index];
    }

    getImagePath({ iconPath, selectedIconPath }, index) {
      return this.getPageId(index) === +this.pageId ? selectedIconPath : iconPath;
    }

    getTextStyle(index) {
      const { color, selected } = this.tabBar.config.style;
      return {
        color: this.getPageId(index) === +this.pageId ? selected.color : color
      };
    }

    handleClick(index) {
      const id = this.getPageId(index);
      if (+this.pageId === id) {
        return;
      }
      this.$nav.nav(id);
    }
  }
</script>

<style lang='scss' scoped>
  .tab-bar {
    height: 60px;

    .image {
      width: 30px;
      height: 30px;
    }

    .text {
      width: 100%;
    }
  }
</style>
