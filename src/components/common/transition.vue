<template>
  <view
    v-if="inited"
    class="bean-transition"
    :class="classNames"
    :style="[styles]"
    @transitionend="onTransitionEnd"
    @click="$emit('click')"
  >
    <slot />
  </view>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

  /**
   *
   * 动画类型  说明
   * fade  淡入
   * fade-up  上滑淡入
   * fade-down  下滑淡入
   * fade-left  左滑淡入
   * fade-right  右滑淡入
   * slide-up  上滑进入
   * slide-down  下滑进入
   * slide-left  左滑进入
   * slide-right  右滑进入
   */
  @Component
  export default class Transition extends Vue {
    @Prop({ type: String, default: 'fade' }) name  // 动画类型
    @Prop({ type: Boolean, default: false }) show  // 是否展示组件
    @Prop({ type: [Number, Object], default: 300 }) duration  // 动画时长，单位为毫秒
    @Prop({ type: Object, default: () => ({}) }) customStyle  // 自定义样式
    @Prop({ type: String }) customClass

    classes = [
      'enter-class',
      'enter-active-class',
      'enter-to-class',
      'leave-class',
      'leave-active-class',
      'leave-to-class',
    ].join(' ')
    currentDuration = 300
    display = false
    inited = false

    get styles() {
      return {
        transitionDuration: `${this.currentDuration || 0}ms`,
        display: this.display ? 'block' : 'none',
        ...this.customStyle
      };
    }

    get classNames() {
      return `${this.classes} ${this.customClass}`;
    }

    @Watch('show', { immediate: true })
    async handleShowChange(value, old = false) {
      if (value === old) {
        return;
      }
      try {
        await (value ? this.enter() : this.leave());
      } catch (e) {
        if (/incongruent status/.test(e.message)) {
          /* eslint-disable-next-line */
          console.warn(e.message)
        } else {
          throw e;
        }
      }
    }

    getClassNames(name) {
      return {
        enter: `bean-${name}-enter bean-${name}-enter-active enter-class enter-active-class`,
        'enter-to': `bean-${name}-enter-to bean-${name}-enter-active enter-to-class enter-active-class`,
        leave: `bean-${name}-leave bean-${name}-leave-active leave-class leave-active-class`,
        'leave-to': `bean-${name}-leave-to bean-${name}-leave-active leave-to-class leave-active-class`,
      };
    }

    isObj(target) {
      return typeof target === 'object' && target !== null;
    }

    async enter() {
      const { duration, name } = this;
      const classNames = this.getClassNames(name);
      const currentDuration = this.isObj(duration) ? duration.enter : duration;
      this.status = 'enter';
      this.$emit('before-enter');  // 进入前触发事件

      await this.$nextTick();
      this.checkStatus('enter');
      this.$emit('enter');  // 进入中触发事件
      this.inited = true;
      this.display = true;
      this.classes = classNames.enter;
      this.currentDuration = currentDuration;

      await this.$nextTick();
      this.checkStatus('enter');
      this.transitionEnded = false;
      this.classes = classNames['enter-to'];
    }

    async leave() {
      if (!this.display) {
        return;
      }

      const { duration, name } = this;
      const classNames = this.getClassNames(name);
      const currentDuration = this.isObj(duration) ? duration.leave : duration;

      this.status = 'leave';
      this.$emit('before-leave');  // 离开前触发事件

      await this.$nextTick();
      this.checkStatus('leave');
      this.$emit('leave');  // 离开中触发事件
      this.classes = classNames.leave;
      this.currentDuration = currentDuration;

      await this.$nextTick();
      this.checkStatus('leave');
      this.transitionEnded = false;
      setTimeout(() => this.onTransitionEnd(), currentDuration);
      this.classes = classNames['leave-to'];
    }

    checkStatus(status) {  // 'enter' | 'leave'
      if (status !== this.status) {
        // 如果不一致，需要报错中断本次运行
        throw new Error(`[Warn]: incongruent status: ${status}`);
      }
    }

    onTransitionEnd() {
      if (this.transitionEnded) {
        return;
      }

      this.transitionEnded = true;
      this.$emit(`after-${this.status}`);  // 进入||离开 后触发事件

      const { show, display } = this;
      if (!show && display) {
        this.display = false;
      }
    }
  }
</script>

<style lang="scss">
  .bean-transition {
    transition-timing-function: ease;
  }

  .bean-fade-enter-active,
  .bean-fade-leave-active {
    transition-property: opacity;
  }

  .bean-fade-enter,
  .bean-fade-leave-to {
    opacity: 0;
  }

  .bean-fade-up-enter-active,
  .bean-fade-up-leave-active,
  .bean-fade-down-enter-active,
  .bean-fade-down-leave-active,
  .bean-fade-left-enter-active,
  .bean-fade-left-leave-active,
  .bean-fade-right-enter-active,
  .bean-fade-right-leave-active {
    transition-property: opacity, transform;
  }

  .bean-fade-up-enter,
  .bean-fade-up-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  .bean-fade-down-enter,
  .bean-fade-down-leave-to {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  .bean-fade-left-enter,
  .bean-fade-left-leave-to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .bean-fade-right-enter,
  .bean-fade-right-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .bean-slide-up-enter-active,
  .bean-slide-up-leave-active,
  .bean-slide-down-enter-active,
  .bean-slide-down-leave-active,
  .bean-slide-left-enter-active,
  .bean-slide-left-leave-active,
  .bean-slide-right-enter-active,
  .bean-slide-right-leave-active {
    transition-property: transform;
  }

  .bean-slide-up-enter,
  .bean-slide-up-leave-to {
    transform: translate3d(0, 100%, 0);
  }

  .bean-slide-down-enter,
  .bean-slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }

  .bean-slide-left-enter,
  .bean-slide-left-leave-to {
    transform: translate3d(-100%, 0, 0);
  }

  .bean-slide-right-enter,
  .bean-slide-right-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
