<script>
  /* eslint-disable pathname/match-name */
  import { confirm } from '@/utils';

  export default {
    onShow() {
      this.checkUpdateManager();
    },
    methods: {
      // 新版本提示
      checkUpdateManager() {
        const updateManager = uni.getUpdateManager();
        updateManager.onUpdateReady(async () => {
          await confirm('新版本已经准备好，是否重启应用？');
          updateManager.applyUpdate();
        });
      }
    }
  };
</script>

<style lang="scss">
  /*每个页面公共css */
  @import './styles/flex.scss';

  page {
    @include padding-bottom-safe-area();
    font-size: 14px;
    color: #333333;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .text-color-primary {
    color: $primary;
  }

  .text-center {
    text-align: center;
  }

  .text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-overflow-2 {
    @include text-overflow(2);
  }

  // 重置 button 样式，当做 div 使用
  .reset-btn {
    padding: 0;
    margin: 0;
    border-radius: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    background-color: inherit;

    &::after {
      display: none;
    }
  }

  image {
    height: 0;
    vertical-align: top;
  }

  .disabled {
    pointer-events: none;
  }
</style>
