<template>
  <div class="common-notice-bar" :style="{ backgroundColor }">
    <div class="content-container">
      <div class="content" :style="[animationStyle, { color }]">{{ text }}</div>
    </div>
  </div>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

  @Component
  export default class NoticeBar extends Vue {
    @Prop({ type: String, default: '' }) text; // 文字内容
    @Prop({ type: Number, default: 1 }) delay; // 动画延迟时间 (s)
    @Prop({ type: Number, default: 50 }) speed; // 滚动速率 (px/s)
    @Prop({ type: String, default: '#ed6a0c' }) color; // 文本颜色
    @Prop({ type: String, default: '#fffbe8' }) backgroundColor; // 滚动条背景

    animationStyle = {};

    @Watch('text')
    onTextChange() {
      this.runAnimation();
    }

    async mounted() {
      await this.$nextTick();
      this.runAnimation();
    }

    beforeDestroy() {
      clearTimeout(this.timer);
    }

    async runAnimation() {
      const [containerInfo, contentInfo] = await Promise.all([
        this.getNodeInfo('.content-container'),
        this.getNodeInfo('.content')
      ]);

      if (contentInfo.width > containerInfo.width) {
        this.run(contentInfo.width);
      } else {
        this.animationStyle = {
          visibility: 'visible'
        };
      }
    }

    async run(contentWidth) {
      const animationWidth = contentWidth * 2;
      const duration = animationWidth / this.speed;
      this.animationStyle = {
        visibility: 'visible',
        left: '100%',
        transform: `translate3d(-${animationWidth}px, 0, 0)`,
        'transition-duration': `${animationWidth / this.speed}s`,
        'transition-delay': `${this.delay}s`
      };
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        this.animationStyle = {};
        // nextTick不管用
        await this.$nextTick();
        setTimeout(() => this.run(contentWidth), 200);
      }, (duration + this.delay) * 1000);
    }

    getNodeInfo(query) {
      return new Promise(resolve => {
        uni.createSelectorQuery().in(this)
          .select(query)
          .boundingClientRect()
          .exec(res => {
            resolve(res[0]);
          });
      });
    }
  }
</script>

<style lang="scss">
  .common-notice-bar {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 10px;

    .content-container {
      position: relative;
      flex: 1;
      height: 100%;
      overflow: hidden;

      .content {
        position: absolute;
        display: flex;
        align-items: center;
        height: 100%;
        visibility: hidden;
        white-space: nowrap;
        transition-timing-function: linear;
      }
    }
  }
</style>
