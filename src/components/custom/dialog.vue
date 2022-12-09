<template>
  <common-popup :value="showDialog" :customStyle="contentStyle" @close="handleCloseDailog(true)">
    <custom-share-wrapper :event="config.event">
      <div class="dialog-content flex column" @click="handleClickImage">
        <div class='image-wrapper' :style="[imageWrapperStyle]">
          <image :src="config.image" class='flex-1 image' mode="widthFix" :style="[imageStyle]" />
        </div>
        <div class='close flex content-center item-center' @click.stop="handleCloseDailog(false)">X</div>
      </div>
    </custom-share-wrapper>
  </common-popup>
</template>

<script>
  import { Component, Mixins, Model, Prop, Watch } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';
  import _ from 'lodash';

  @Component
  export default class CustomDialog extends Mixins(CustomComponent) {
    @Model('input', Boolean) value
    @Prop(Object) config

    showDialog = false

    get contentStyle() {
      return {
        width: '600rpx',
        backgroundColor: 'transparent'
      };
    }

    get imageWrapperStyle() {
      if (!this.config.style) {
        return {};
      }
      const { height, borderRadius, backgroundColor } = this.config.style;
      return {
        backgroundColor,
        height: height * 2 + 'rpx',
        borderRadius: borderRadius * 2 + 'rpx'
      };
    }

    get imageStyle() {
      if (!this.config.style) {
        return {};
      }
      const { height, borderRadius } = this.config.style;
      return {
        height: height * 2 + 'px',
        borderRadius: borderRadius * 2 + 'rpx'
      };
    }

    @Watch('value')
    valueChange() {
      this.showDialog = this.value;
    }

    handleClickImage() {
      if (_.get(this.config, 'event.name')) {
        this.handleClick(this.config);
        this.handleCloseDailog(true);
      }
    }

    handleCloseDailog(closeBtnTriggerEventForceFalse) {
      const config = { ...this.config };
      closeBtnTriggerEventForceFalse && (config.closeBtnTriggerEvent = false);
      this.$emit('input', false);
      this.$emit('close', config);
    }
  }
</script>

<style lang='scss' scoped>
  .dialog-content {
    position: relative;
    width: 100%;
    height: 100%;

    .image-wrapper {
      width: 100%;
      overflow: auto;
    }

    .image {
      width: 100%;
    }

    .close {
      width: 30px;
      height: 30px;
      margin: 20px auto;
      border: 2px solid #fff;
      border-radius: 50%;
      font-size: 24px;
      color: #fff;
    }
  }
</style>
