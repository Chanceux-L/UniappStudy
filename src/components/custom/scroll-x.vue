<template>
  <scroll-view
    scroll-x
    class="custom-scroll-x"
    :style="[getStyle(config.style.container)]"
    >
    <div class='flex'>
      <div
        v-for="(item, index) in config.items"
        :key="index"
        @click="handleClick(item)"
        class="container"
        :style="[containerStyle]">
        <custom-share-wrapper :event="item.event">
          <image :src="item.image"
            mode="aspectFill"
            class="image"
            :style="[getStyle(config.style.image)]"
          />
          <div class="title"
            v-if="item.title.show"
            :style="[getStyle(config.style.title)]">
            {{ item.title.text }}
          </div>
          <div class="subtitle"
            v-if="item.subtitle.show"
            :style="[getStyle(config.style.subtitle)]">
            {{ item.subtitle.text }}
          </div>
          <div class="desc"
            v-if="item.desc.show"
            :style="[getStyle(config.style.desc)]">
            {{ item.desc.text }}
          </div>
        </custom-share-wrapper>
      </div>
    </div>
  </scroll-view>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';
  import _ from 'lodash';

  @Component
  export default class CustomScrollX extends Mixins(CustomComponent) {
    @Prop(Object) config

    get containerStyle() {
      const { width } = _.get(this.config, 'style.image', {});
      if (!width) {
        return {};
      }
      return this.getStyle({ width });
    }
  }
</script>

<style lang='scss' scoped>
  .custom-scroll-x {
    box-sizing: border-box;
    white-space: nowrap;
  }

  .container {
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }

    .title {
      line-height: 24px;
      white-space: pre-wrap;
    }

    .subtitle {
      line-height: 20px;
      white-space: pre-wrap;
    }

    .desc {
      line-height: 18px;
      white-space: pre-wrap;
    }
  }

  .image {
    width: 100%;
    height: 100%;
  }
</style>
