<template>
  <div class='share-wrapper'>
    <slot />
    <button v-if="event && event.name === 'share'" class="reset-btn share-button" open-type="share"></button>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ShareWrapper extends Vue {
    @Prop(Object) event;
  }
</script>

<style lang='scss' scoped>
  .share-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .share-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
</style>
