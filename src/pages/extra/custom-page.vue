<template>
  <!-- slug 参加不同项目的接口约定 -->
  <custom-page-component :slug="slug"/>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class CustomPage extends Vue {
    @Prop(String) slug
  }
</script>
