<template>
  <div class="common-create-poster">
    <canvas class="canvas" type="2d" id="create-poster-canvas" :style="{ width: width + 'px', height: height + 'px' }"/>
    <div @click="createPoster">
      <slot/>
    </div>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Poster, autoLoading } from '@/utils';

  @Component
  export default class CreatePoster extends Vue {
    @Prop({ type: Number, default: 200 }) width;
    @Prop({ type: Number, default: 200 }) height;
    @Prop({ type: Array, default: () => [] }) config;

    // poster = null 不要在这里设置此属性为 observable，new Poster 会在 json 转换时报错
    img = ''

    mounted() {
      // 推荐直接使用 Poster，后续考虑去掉此组件
      this.poster = new Poster({
        width: this.width,
        height: this.height,
        canvasId: 'create-poster-canvas',
        component: this
      });
    }

    async createPoster() {
      const img = await autoLoading(this.poster.createPoster(this.config));
      this.img = img;
      this.$emit('success', img);
      return img;
    }
  }
</script>

<style lang="scss">
  .common-create-poster {
    .canvas {
      position: fixed;
      left: -200%;
    }
  }
</style>
