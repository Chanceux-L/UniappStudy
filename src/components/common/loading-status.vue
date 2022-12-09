<template>
  <!-- 加载状态显示组件 -->
  <div>
    <!-- 为空状态，显示没有空数据 -->
    <div class="status-wrapper empty" v-if="loadMoreStatus === 'empty'">
      <div class="text" v-if="!$slots.empty && emptyText">{{ emptyText }}</div>
      <slot name="empty" />
    </div>

    <!-- 默认状态，提示用户可以滚动加载 -->
    <div class="status-wrapper more" v-if="loadMoreStatus === 'more'">
      <div class="text" v-if="!$slots.staticMore && staticText">{{ staticText }}</div>
      <slot name="staticMore" />
    </div>

    <!-- 加载中状态，显示正在加载 -->
    <div class="status-wrapper loading" v-if="loadMoreStatus === 'loading'">
      <div class="text" v-if="!$slots.loadMore && loadingMoreText">
        <common-loading :text="loadingMoreText"/>
      </div>
      <slot name="loadingMore" />
    </div>

    <!-- 全部加载完成状态，显示没有更多数据了 -->
    <div class="status-wrapper no-more" v-if="loadMoreStatus === 'noMore'">
      <div class="text" v-if="!$slots.noMore && noMoreText">{{ noMoreText }}</div>
      <slot name="noMore" />
    </div>

    <!-- 加载出错时状态 -->
    <div class="status-wrapper error" v-if="loadMoreStatus === 'error'">
      <div class="text" v-if="!$slots.error && errorText" @click="$emit('retry')">{{ errorText }}</div>
      <slot name="error" />
    </div>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { PropReference } from '@/plugins/prop-reference';
  import { Collection, SimpleStore } from '@/stores';

  @Component
  export default class LoadingStatus extends Vue {
    @PropReference({ type: SimpleStore }) store                                  // store 实例
    @Prop({ type: [String, Boolean], default: '加载失败，点击重试！' }) errorText    // 加载失败时的文案
    @Prop({ type: [String, Boolean], default: '暂无数据' }) emptyText             // 为空时的文案
    @Prop({ type: [String, Boolean], default: '加载中...' }) loadingMoreText     // 加载中的文案
    @Prop({ type: [String, Boolean], default: '没有更多了 ~' }) noMoreText        // 没有更多数据时的文案
    @Prop({ type: [String, Boolean], default: '上滑加载更多' }) staticText        // 默认静止时的文案

    get loadMoreStatus() {
      if (this.store instanceof Collection) {
        if (this.store.isEmpty) { return 'empty'; }
        if (this.store.isComplete) { return 'noMore'; }
        if (this.store.isFetching) { return 'loading'; }
        if (this.store.isRejected) { return 'error'; }
        return 'more';
      } else {
        if (this.store.isFetching) { return 'loading'; }
        if (this.store.isRejected) { return 'error'; }
        return '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .status-wrapper {
    .text {
      padding: 20px;
      text-align: center;
      color: #999;

      &.empty {
        padding: 50px 10px;
      }
    }
  }
</style>
