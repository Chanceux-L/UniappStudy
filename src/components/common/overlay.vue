<template>
  <common-transition :show="show" :duration="duration" @touchmove.stop :custom-style="overlayStyle" @click="handleOverlayClick">
  </common-transition>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class Overlay extends Vue {
    @Prop() duration  // 动画时长，单位为毫秒
    @Prop({ type: Boolean }) show;
    @Prop({ type: Number, default: 100 }) zIndex;
    @Prop({ type: Object, default: () => Object.create({}) }) customStyle;

    get overlayStyle() {
      return {
        zIndex: this.zIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'background-color': 'rgba(0, 0, 0, .7)',
        ...this.customStyle
      };
    }

    handleOverlayClick() {
      this.$emit('overlayClick');
    }
  }
</script>

<style lang="scss" scoped>
  .bean-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
  }
</style>
