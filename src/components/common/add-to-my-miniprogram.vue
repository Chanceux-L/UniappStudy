<template>
  <div
    v-if="show"
    class="common-add-to-my-miniprogram"
    :style="{ right: `calc(100vw - ${menu.right}px)`, top: `${customNavbar ? menu.top + menu.height + 20 : 10 }px` }"
    @click.stop="handleClose"
  >
    <div class="content">
      <div
        class="triangle"
        :style="{ right: `${menu.width / 2 + menu.width / 4 - 15}px` }"
      ></div>
      <text>{{ text }}</text>
    </div>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';

  const STORAGE_KEY = `${process.env.NODE_ENV}_add_to_my_miniprogram`;

  @Component
  export default class AddToMyMiniProgram extends Vue {
    @Prop({ type: String, default: '点击添加「我的小程序」，下次访问更便捷' }) text;
    @Prop({ type: Number, default: 6000 }) duration;
    @Prop(Boolean) customNavbar;

    show = false;
    menu = {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0
    }

    mounted() {
      if (!uni.getStorageSync(STORAGE_KEY)) {
        const res = uni.getMenuButtonBoundingClientRect();
        this.menu = res;
        this.show = true;
        uni.setStorage({ key: STORAGE_KEY, data: '1' });

        this.timer = setTimeout(() => {
          this.handleClose();
        }, this.duration);
      }
    }

    beforeDestroy() {
      clearTimeout(this.timer);
    }

    handleClose() {
      this.show = false;
    }
  }
</script>


<style lang="scss">
  .common-add-to-my-miniprogram {
    position: fixed;
    z-index: 9999;
    top: 10px;
    height: 34px;
    padding: 0 10px;
    border-radius: 6px;
    color: #fff;
    background: $primary;

    .content {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .triangle {
      position: absolute;
      top: -16px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-bottom: 8px solid $primary;
      transform: translateX(4px);
    }
  }
</style>
