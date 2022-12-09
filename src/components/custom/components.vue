<template>
  <div class="components">
    <common-effect v-for="row in components"
      :key="row.key"
      :animation-name="row.config.animation.type">
      <custom-swiper
        v-if="row.name === 'swiper'"
        :config="row.config"
      />
      <custom-text
        v-if="row.name === 'text'"
        :config="row.config"
      />
      <custom-rich-text
        v-if="row.name === 'rich-text'"
        :config="row.config"
      />
      <custom-image
        v-if="row.name === 'image'"
        :config="row.config"
      />
      <custom-multiple-image
        v-if="row.name === 'multiple-image'"
        :config="row.config"
      />
      <custom-nav-bar
        v-if="row.name === 'navbar'"
        :config="row.config"
      />
      <custom-video
        v-if="row.name === 'video'"
        :config="row.config"
      />
      <custom-scroll-x
        v-if="row.name === 'scroll-x'"
        :config="row.config"
      />
      <custom-form
        v-if="row.name === 'form'"
        :config="row.config"
      />
      <custom-blank
        v-if="row.name === 'blank'"
        :config="row.config"
      />
      <custom-split
        v-if="row.name === 'split-line'"
        :config="row.config"
      />
      <custom-title
        v-if="row.name === 'title'"
        :config="row.config"
      />
      <custom-dialog
        v-if="row.name === 'custom-dialog'"
        :config="row.config"
      />
      <custom-map
        v-if="row.name === 'map'"
        :config="row.config"
      />
      <custom-product-list
        v-if="row.name === 'custom-product-list'"
        :config="row.config"
      />
      <custom-image-area
        v-if="row.name === 'image-area'"
        :config="row.config"
        :component-title="row.title"
      />
    </common-effect>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class CustomComponents extends Vue {
    @Prop(Array) components
  }
</script>

<style lang='scss' scoped>
  .components {
    height: 100%;
  }
</style>
