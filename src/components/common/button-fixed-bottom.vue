<template>
  <view :style="[style]" class="bean-button-fixed-bottom">
    <div class="fixed-footer" :style="[style, { background: bgColor, zIndex }]">
      <div :id="footer" class="content" :class="[componentClass]"><slot/></div>
    </div>
  </view>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { uiStore } from '@/stores';

  @Component
  export default class ButtonFixedBottom extends Vue {
    @Prop({ type: String, default: '#fff' }) bgColor
    @Prop({ type: Number, default: 99 }) zIndex
    uiStore = uiStore
    contentHeight = 0

    get componentClass() {
      return `component-fixed-button-${this._uid}`;
    }

    get style() {
      return {
        height: `${this.contentHeight}px`,
        boxSizing: 'content-box'
      };
    }

    mounted() {
      this.run();
    }

    run() {
      const query = uni
        .createSelectorQuery()
        // #ifdef MP-WEIXIN
        .in(this);
        // #endif

      query.select(`.${this.componentClass}`).boundingClientRect(data => {
        this.contentHeight = data.height;
      }).exec();
    }
  }
</script>

<style lang="scss">
  .bean-button-fixed-bottom {
    @include padding-bottom-safe-area();

    .fixed-footer {
      @include padding-bottom-safe-area();
      position: fixed;
      bottom: 0;
      width: 100%;
    }
  }
</style>
