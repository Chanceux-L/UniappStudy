<template>
  <div class='page' :style="[pageStyle]">
    <common-loading-screen :onFetch.reference="onFetch"/>
    <custom-components :components='components' @poster="handleCreatePoster"/>
    <common-create-poster
      ref="poster"
      :width="300"
      :height="520"
      :config="posterConfig"
      @success="handleCreatePosterSuccess"
      >
    </common-create-poster>
    <common-popup v-model="showPosterDialog"
      :customStyle="postContentStyle">
      <div class="poster-container flex wrap content-center">
        <image :src="posterUrl" class='poster-image' mode="widthFix" />
        <div class="actions flex content-between">
          <button class="reset-btn btn" open-type="share" @click="showPosterDialog = false">分享好友</button>
          <div class="btn" @click="saveShareImage">保存海报分享</div>
        </div>
      </div>
    </common-popup>
    <custom-dialog
      v-model="showDialog"
      :config="dialogConfig"
      @close="handleCloseDailog"
    />
  </div>
</template>

<script>
  import { Component, Prop, Mixins } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';
  import { request, downloadQrcode, Storage } from '@/utils';
  import { CUSTOM_PAGE_EJECTED_POPUP_LIST_KEY } from '@/constants';
  import _ from 'lodash';

  const ejectedPopupStorage = new Storage(CUSTOM_PAGE_EJECTED_POPUP_LIST_KEY);

  @Component
  export default class CustomPageComponent extends Mixins(CustomComponent) {
    @Prop(String) slug

    components = []
    pageConfig = {}

    shareConfig = {}
    posterUrl = ''
    showPosterDialog = false

    popups = []
    dialogConfig = {}
    showDialog = false

    qrcodeUrl = ''

    eventClearList = []

    get posterConfig() {
      const { poster } = this.pageConfig;
      if (!poster) {
        return [];
      }
      const { miniProgram: { envVersion } } = uni.getAccountInfoSync();
      return [
        {
          type: 'background',
          top: 0,
          left: 0,
          width: 300,
          height: 520,
          color: poster.backgroundColor
        },
        {
          type: 'image',
          top: 0,
          left: 0,
          width: 300,
          height: 400,
          mode: 'aspectFill',
          url: poster.backgroundImage
        },
        {
          type: 'image',
          top: 410,
          left: 210,
          width: 80,
          height: 80,
          round: envVersion === 'release' ? 40 : 0,
          url: this.qrcodeUrl
        },
        {
          type: 'text',
          top: 500,
          left: 210,
          fontSize: 12,
          color: poster.textColor,
          text: '长按识别小程序'
        },
        {
          type: 'text',
          top: 420,
          left: 10,
          maxWidth: 180,
          fontSize: 16,
          color: poster.textColor,
          text: poster.text || ''
        }
      ];
    }

    get pageStyle() {
      if (!this.pageConfig.style) {
        return {};
      }
      return this.getStyle(this.pageConfig.style);
    }

    get postContentStyle() {
      return {
        width: '300px',
        top: '45%',
        background: 'transparent'
      };
    }

    async onFetch() {
      // TODO: 根据不同项目定义接口
      const { data } = await request.get(`bean/custom_pages/${this.slug}`);
      if (!data.configs) {
        return;
      }
      const configs = JSON.parse(data.configs);
      const components = configs.components;
      components.forEach((item) => {
        if (item.config) {
          item.config.pageId = this.slug;
        }
      });
      this.components = components;
      this.pageConfig = configs.config;
      this.setNavbar(configs.config);

      this.popups = this.components.filter(v => v.name === 'popup');
      this.autoPopups = this.popups.filter(v => v.config.autoOpen);
      this.handleShowPopup();

      const share = _.get(this.pageConfig, 'share', {});
      this.$emit('pageConfig', {
        id: this.slug,
        title: share.title,
        imageUrl: share.imageUrl
      });
      this.addEvent(this.slug);
    }

    handleShowPopup() {
      if (!this.autoPopups.length) {
        return;
      }
      const popup = this.autoPopups.pop();
      const popupCount = ejectedPopupStorage.get(popup.key) || 0;
      // 如果设置弹窗次数，大于已经弹窗次数，就弹窗，否则弹下一个 popup
      if (popupCount < popup.config.showTimes) {
        this.dialogConfig = popup.config;
        this.showDialog = true;
        ejectedPopupStorage.set(popup.key, popupCount + 1);
      } else {
        this.handleShowPopup();
      }
    }

    setNavbar(pageConfig) {
      uni.setNavigationBarTitle({ title: pageConfig.title || '' });
      const { backgroundColor, color } = _.get(pageConfig, 'style.title', {});
      uni.setNavigationBarColor({
        frontColor: color || '#000000',
        backgroundColor: backgroundColor || '#F8F8F8'
      });
    }

    // 弹窗 海报事件
    addEvent(pageId) {
      if (this.eventClearList.length) {
        return;
      }
      this.eventClearList = [
        this.$service.subscribe('createPoster', async () => {
          if (this.posterConfig.length) {
            if (!this.qrcodeUrl) {
              let path = this.$nav.currentPage.$page.fullPath;
              if (path.indexOf('?') > -1) {
                path = path.slice(0, path.indexOf('?'));
              }
              if (path[0] === '/') {
                path = path.slice(1, path.length);
              }
              this.qrcodeUrl = await this.$autoLoading(downloadQrcode({
                page: path,
                scene: `id=${pageId}`
              }));
            }
            this.$refs.poster.createPoster();
          }
        }),
        this.$service.subscribe('createDialog', (data) => {
          const popup = this.popups.find(v => v.key === data.popup);
          if (popup) {
            this.dialogConfig = popup.config;
            this.showDialog = true;
          }
        }),
        this.$service.subscribe('pullDownRefresh', async () => {
          try {
            await this.getCustomInfo(pageId);
            this.initPage(pageId);
          } finally {
            uni.stopPullDownRefresh();
          }
        })
      ];
    }

    handleCreatePosterSuccess(url) {
      this.posterUrl = url;
      this.showPosterDialog = true;
    }

    async saveShareImage() {
      await this.$saveFiles(this.posterUrl);
      await this.$showToast('保存成功');
      this.showPosterDialog = false;
    }

    handleCloseDailog(data) {
      // 有设置关闭弹窗 触发点击事件，才触发点击事件
      data.closeBtnTriggerEvent && this.handleClick(data);
      // 关闭后弹下一个弹窗
      setTimeout(() => {
        this.handleShowPopup();
      }, 200);
    }

    beforeDestroy() {
      this.eventClearList.forEach(clear => {
        clear();
      });
    }
  }
</script>

<style lang='scss' scoped>
  .page {
    min-height: 100vh;
  }

  .poster-container {
    .poster-image {
      width: 250px;
      border-radius: 8px;
    }

    .actions {
      box-sizing: border-box;
      width: 100%;
      padding: 0 16px;
      margin-top: 20px;
      font-size: 12px;
      color: #f9f9f9;

      // TODO 按钮颜色待调整
      .btn {
        width: 100px;
        height: 40px;
        border-radius: 8px;
        line-height: 40px;
        text-align: center;
        background-color: #dd524d;
      }
    }
  }
</style>
