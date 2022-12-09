<template>
  <div class="bean-popup">
    <common-overlay :show="overlay && value" :duration="duration" :customStyle="popupOverlayStyle"  @overlayClick="handleOverlayClick" />

    <common-transition
      :show="value"
      :custom-style="popupStyle"
      :name="animationName"
      :custom-class="`popup ${position}`"
      @after-leave="$emit('after-leave')"
      :duration="duration"
    >
      <slot />
    </common-transition>
  </div>
</template>

<script>
  import { Vue, Component, Prop, Model } from 'vue-property-decorator';
  import _ from 'lodash';

  @Component
  export default class Popup extends Vue {
    @Prop({ type: Number, default: 101 }) zIndex;
    @Prop({ type: Boolean, default: true }) overlay;
    @Prop({ type: String, default: 'center' }) position;
    @Prop({ type: Boolean, default: true }) closeOnClickOverlay;
    @Prop({ type: Object, default: () => Object.create({}) }) customStyle;
    @Prop({ type: Object, default: () => Object.create({}) }) overlayStyle;
    @Prop({ type: [Boolean, String], default: false }) round;
    @Prop({ type: [Number, Object], default: 300 }) duration  // 动画时长，单位为毫秒
    @Model('input', { type: Boolean, default: false }) value;

    get popupOverlayStyle() {
      return {
        zIndex: this.zIndex - 1,
        ...this.overlayStyle
      };
    }

    get popupStyle() {

      const positionStyles = {
        center: {
          top: '50%',
          left: '50%',
          transform: 'translate3d(-50%, -50%, 0)',
        },
        top: {
          top: 0,
          left: 0,
          width: '100%',
        },
        bottom: {
          bottom: 0,
          left: 0,
          width: '100%',
        },
        left: {
          height: '100%',
          top: 0,
          left: 0,
        },
        right: {
          height: '100%',
          top: 0,
          right: 0,
        }
      };

      return {
        zIndex: this.zIndex,
        borderRadius: this.round ? (_.isString(this.round) ? this.round : '32rpx') : 0,
        position: 'fixed',
        background: '#fff',
        ...positionStyles[this.position],
        ...this.customStyle,
      };
    }

    get animationName() {
      const animationMap = {
        top: 'slide-down',
        bottom: 'slide-up',
        left: 'slide-left',
        right: 'slide-right',
        center: 'fade'
      };
      return animationMap[this.position];
    }

    handleOverlayClick() {
      if (this.closeOnClickOverlay) {
        this.$emit('input', false);
        this.$emit('close');
      }
    }
  }
</script>
