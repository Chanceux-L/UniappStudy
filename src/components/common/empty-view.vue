<template>
  <div class="empty flex column item-center">
    <image class="empty-img" src="/static/empty.png" mode="widthFix"/>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String, default: '暂无数据'
      }
    }
  };
</script>

<style lang="scss">
  .empty {
    margin-top: 40px;
    color: $text-color-sm;

    .empty-img {
      width: 80px;
      margin-bottom: 15px;
    }
  }
</style>
