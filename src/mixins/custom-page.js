import { Vue, Component } from 'vue-property-decorator';

@Component
export default class CustomPageMixin extends Vue {
  pageConfig = {}

  setPageConfig(config) {
    this.pageConfig = config;
  }

  onPullDownRefresh() {
    this.$service.pullDownRefresh({
      pageId: this.pageConfig.id
    });
  }

  onShareAppMessage() {
    return this.$mergeShareAppMessage(this.pageConfig);
  }
}
