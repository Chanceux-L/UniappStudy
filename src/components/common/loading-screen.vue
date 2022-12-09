<template>
  <div class="loading-screen loading" v-if="loading" :style="{ paddingTop: `calc(${position_top} + 20px)` }">
    <common-loading/>
  </div>
  <div class="loading-screen error" v-else-if="error" :style="{ paddingTop: `calc(${position_top} + 50px)` }">
    <div @click="handleLoad" class="flex column item-center">
      <image src="/static/refresh.png" style="width: 90px;" mode="widthFix"/>
      <text class="text-center error-text">
        {{ errorMessage }}
        {{ error.code === blockCode ? '' : '点击重新加载' }}
      </text>
    </div>
    <button type="default" @click="$nav.navigateBack()" class="action-btn">
      返回
    </button>
  </div>
</template>

<script>
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import _ from 'lodash';
  import { PropReference } from '@/plugins/prop-reference';

  @Component
  export default class LoadingScreen extends Vue {
    @PropReference({ type: Function }) onFetch
    @Prop({ type: Boolean, default: false }) usedCustomNav
    @Prop({ type: Boolean, default: true }) auth

    loading = true
    error = null
    blockCode = 40101

    get errorMessage() {
      const timeoutErrors = /(request:fail timeout)|(timeout.*\d+ms)/i;
      const msg = _.get(this.error, 'message');
      return timeoutErrors.test(msg) ? '网络好像出了点问题，请稍后再试' : msg;
    }

    mounted() {
      this.handleLoad();
    }

    async handleLoad() {
      if (_.get(this.error, 'code') === this.blockCode) {
        return;
      }
      this.loading = true;
      this.error = null;

      try {
        await Promise.all([
          this.auth && this.$authStore.tryFetchData(),
          this.$settings.tryFetchData(),
        ]);

        await this.onFetch();
        this.loading = false;
      } catch (err) {
        this.error = {
          message: err.message,
          code: err.code,
        };
        this.loading = false;
        throw err;
      }
    }

    get position_top() {
      if (process.env.VUE_APP_PLATFORM === 'h5') {
        return '0px';
      }
      const { bottom } = uni.getMenuButtonBoundingClientRect();
      return this.usedCustomNav ? `${bottom + 7}px` : '0px';
    }
  }
</script>

<style lang="scss">
  .loading-screen {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 10px 20px;
    background: #fff;

    .error-text {
      margin-top: 20px;
      font-weight: bold;
      font-size: 18px;
    }

    .action-btn {
      width: 120px;
      height: 40px;
      margin-top: 20px;
      line-height: 40px;
    }
  }
</style>
