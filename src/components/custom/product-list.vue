<template>
  <div class='flex content-between wrap'
    :style="[getStyle(config.style)]"
    v-if="products.length">
    <!-- TODO: 各个项目不同，需要自行实现自定义商品样式 -->
  </div>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomProductList extends Mixins(CustomComponent) {
    @Prop(Object) config

    products = []

    async mounted() {
      // TODO: 根据不同项目定义接口
      // 悄悄进行，哪怕出错了也不影响整体
      const { data } = await this.$request(`bean/custom_variant_lists/${this.config.customProductId}`);
      this.products = data.store_variants;
    }

    handleClick(item) {
      this.$nav.nav(`/pages/products/detail?id=${item.id}`);
    }
  }
</script>

<style lang='scss' scoped>
</style>
