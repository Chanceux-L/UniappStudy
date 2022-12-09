<template>
  <custom-share-wrapper :event="config.event">
    <div class="custom-title" :style="[getStyle(config.style)]" @click="handleClick(config)">
      <div :class="['content', 'style' + config.type.name]" :style="[typeStyle]">
        <div class="line" :style="[lineStyle]"></div>
        <div class="title" :style="[textStyle]">{{ config.text }}</div>
        <div class="line" :style="[lineStyle]"></div>
      </div>
    </div>
  </custom-share-wrapper>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomTitle extends Mixins(CustomComponent) {
    @Prop(Object) config

    get typeStyle() {
      const { style: { backgroundColor }, name } = this.config.type;
      if (name === 1) {
        return {
          borderColor: backgroundColor
        };
      }
      return {};
    }

    get textStyle() {
      const { type, style } = this.config;
      if (type.name !== 2) {
        return {};
      }
      return { backgroundColor: style.backgroundColor ? style.backgroundColor : 'transparent' };
    }

    // style2样式
    get lineStyle() {
      const { style: { backgroundColor } } = this.config.type;
      return { backgroundColor };
    }
  }
</script>

<style lang='scss' scoped>
  .custom-title {
    .content {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      .line {
        display: none;
      }

      &.style1 {
        display: block;
        border-left: 4px solid #000;

        .title {
          height: 100%;
          margin-left: 10px;
        }
      }
      // 底部划线 之后可能用得上
      // &.line-bottom {
      //   border-bottom: 2px solid #000;

      //   .title {
      //     display: flex;
      //     align-items: center;
      //     height: 100%;
      //   }
      // }
      &.style2 {
        height: 100%;

        .title {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          height: 100%;
          padding: 0 10px;
          background-color: #fff;
        }

        .line {
          display: block;
          flex: 1;
          height: 2px;
        }
      }
    }
  }
</style>
