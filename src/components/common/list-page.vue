<template>
  <div class="common-list-page">
    <scroll-view
      class="list-scroll-view"
      scroll-y
      :refresher-enabled="refresherEnabled"
      :refresher-triggered="isTriggered"
      :refresher-threshold="refresherThreshold"
      :refresher-default-style="refresherDefaultStyle"
      :refresher-background="refresherBackground"
      :lower-threshold="lowerThreshold"
      @scrolltolower="handleScrollToLower"
      @refresherpulling="handleRefresherPulling"
      @refresherrefresh="handleRefresherRefresh"
    >
      <!-- 数据列表显示 -->
      <div class="list-wrapper">
        <slot/>
      </div>

      <common-loading-status
        :store.reference="store"
        @retry="handleScrollToLower"
        :error-text="errorText"
        :empty-text="emptyText"
        :loading-more-text="loadingMoreText"
        :no-more-text="noMoreText"
        :static-text="staticText"
      >
        <template v-if="$slots.empty"><slot name="empty" /></template>
        <template v-if="$slots.staticMore"><slot name="staticMore" /></template>
        <template v-if="$slots.loadingMore"><slot name="loadingMore" /></template>
        <template v-if="$slots.noMore"><slot name="noMore" /></template>
        <template v-if="$slots.error"><slot name="error" /></template>
      </common-loading-status>
    </scroll-view>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { PropReference } from '@/plugins/prop-reference';
  import { Collection } from '@/stores';

  @Component
  export default class ListPage extends Vue {
    @PropReference({ type: Collection }) store                        // Collection 实例
    @Prop({ type: [String, Boolean], default: '加载失败，点击重试!' }) errorText    // 加载失败时的文案
    @Prop({ type: [String, Boolean], default: '暂无数据' }) emptyText             // 为空时的文案
    @Prop({ type: [String, Boolean], default: '加载中...' }) loadingMoreText     // 加载中的文案
    @Prop({ type: [String, Boolean], default: '没有更多了 ~' }) noMoreText        // 没有更多数据时的文案
    @Prop({ type: [String, Boolean], default: '上滑加载更多' }) staticText        // 默认静止时的文案
    @Prop({ type: Boolean, default: false }) refresherEnabled        // 开启自定义下拉刷新
    @Prop({ type: Number, default: 45 }) refresherThreshold          // 设置自定义下拉刷新阈值
    @Prop({ type: String, default: 'black' }) refresherDefaultStyle  // 设置自定义下拉刷新默认样式，支持设置 black | white | none， none 表示不使用默认样式
    @Prop({ type: String, default: '#FFF' }) refresherBackground     // 设置自定义下拉刷新区域背景颜色
    @Prop({ type: Number, default: 50 }) lowerThreshold              // 距离底部多少时触发滚动加载更多

    isTriggered = false

    handleRefresherPulling() {
      this.isTriggered = true;
    }

    async handleRefresherRefresh() {
      try {
        await this.store.fetchData();
      } finally {
        this.isTriggered = false;
      }
    }

    handleScrollToLower() {
      this.store.fetchMoreData();
    }
  }
</script>

<style lang="scss">
  .common-list-page {
    position: relative;
    height: 100%;

    .list-scroll-view {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .status-wrapper {
      &.empty-wrapper {
        .text {
          padding: 50px 10px;
        }
      }

      .text {
        padding: 10px;
        text-align: center;
        color: #999;
      }
    }
  }
</style>
