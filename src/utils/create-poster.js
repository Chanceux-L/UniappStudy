/* eslint-disable no-unreachable */
import _ from 'lodash';

export class Poster {
  constructor({
                canvasId = '',
                width = 200,
                height = 200,
                dpr = this.getDpr(),
                config = [],
                component = {}
              } = {}) {
    this.canvasId = canvasId;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.config = config;
    this.component = component;
  }

  getDpr() {
    let dpr = 2;
    try {
      dpr = uni.getSystemInfoSync().pixelRatio;
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
    return dpr;
  }

  async createPoster(config) {
    if (config) {
      this.config = config;
    }
    if (this.ctx) {
      // #ifdef MP-WEIXIN
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // #endif

      // #ifdef MP-ALIPAY
      this.ctx.clearRect(0, 0, this.width, this.height);
      // #endif

      // #ifdef H5
      this.ctx.clearRect(0, 0, this.width, this.height);
      // #endif
      return this.drawByType(this.ctx, this.canvas);
    }

    // #ifdef MP-ALIPAY
    this.ctx = uni.createCanvasContext(this.canvasId, this.component);
    return this.drawByType(this.ctx);
    // #endif

    // #ifdef H5
    this.canvas = this.component.$el.querySelector(`[canvas-id="${this.canvasId}"] canvas`);
    this.ctx = this.canvas.getContext('2d');
    return this.drawByType(this.ctx);
    // #endif

    // #ifdef MP-WEIXIN
    return new Promise((resolve, reject) => {
      const query = uni.createSelectorQuery().in(this.component);
      query.select(`#${this.canvasId}`)
        .fields({ node: true })
        .exec(res => {
          const canvas = this.canvas = res[0].node;
          const ctx = this.ctx = canvas.getContext('2d');
          canvas.width = this.width * this.dpr;
          canvas.height = this.height * this.dpr;
          ctx.scale(this.dpr, this.dpr);
          this.drawByType(ctx, canvas)
            .then(resolve)
            .catch(reject);
        });
    });
    // #endif
  }

  draw(ctx) {
    return new Promise((resolve) => {
      ctx.draw(true, resolve);
    });
  }

  async drawByType(ctx, canvas) {
    const cloneConfig = _.cloneDeep(this.config);
    for (const config of cloneConfig) {
      switch (config.type.toLowerCase()) {
        case 'draw':
          await this.customDraw(ctx, config);
          break;
        case 'image':
          await this.drawImage(ctx, config, canvas);
          break;
        case 'text':
          this.handleDrawText(ctx, config);
          break;
        case 'line':
          this.drawLine(ctx, config);
          break;
        case 'background':
          this.drawBackground(ctx, config);
          break;
        case 'border':
          this.drawBorder(ctx, config);
          break;
        case 'arc':
          this.drawCircle(ctx, config);
          break;
      }
      // #ifdef MP-ALIPAY
      await this.draw(ctx);
      // #endif
    }
    // #ifdef MP-ALIPAY
    const { apFilePath } = await ctx.toTempFilePath();
    return apFilePath;
    // #endif

    // #ifdef H5
    const res = await uni.canvasToTempFilePath({ canvasId: this.canvasId }, this.component);
    return res.tempFilePath;
    // #endif

    // #ifdef MP-WEIXIN
    // https://developers.weixin.qq.com/community/develop/article/doc/000cca357f07e0be99eacad095bc13
    const { tempFilePath } = await uni.canvasToTempFilePath({ canvas: this.canvas });
    return tempFilePath;
    // #endif
  }

  customDraw(ctx, config) {
    if (_.isFunction(config.draw)) {
      return config.draw({ ctx, config });
    }
  }

  async execDrawImage(ctx, config, img) {
    ctx.save();
    const { top, left, width, height, url, mode } = config;
    this.clipRound(ctx, config);
    if (mode) {
      const info = typeof img === 'string' ? (await uni.getImageInfo({ src: url })) : img;
      ctx.beginPath();
      ctx.rect(left, top, width, height);
      ctx.clip();
      if (mode === 'top') {
        const newHeight = width / info.width * info.height;
        ctx.drawImage(img, left, top, width, newHeight);
      } else if (mode === 'aspectFit' || mode === 'aspectFill') {
        const ratio = Math[mode === 'aspectFit' ? 'min' : 'max'](width / info.width, height / info.height);
        const newHeight = Math.round(ratio * info.height);
        const newWidth = Math.round(ratio * info.width);
        ctx.drawImage(img, left - ((newWidth - width) / 2), top - ((newHeight - height) / 2), newWidth, newHeight);
      } else {
        ctx.drawImage(img, left, top, width, height);
      }
    } else {
      ctx.drawImage(img, left, top, width, height);
    }
    ctx.restore();
  }

  async loadImage(url, canvas) {
    // #ifdef H5
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = url;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
    // #endif

    if (/^https?:\/\//.test(url)) {
      let header = {};
      if (url.match(process.env.VUE_APP_API_HOST)) {
        const { authStore } = require('@/stores/auth-store');
        header = { Authorization: authStore.access_token };
      }
      const { tempFilePath } = await uni.downloadFile({ url, header });
      url = tempFilePath;
    }

    if (process.env.VUE_APP_PLATFORM === 'mp-weixin') {
      const img = canvas.createImage();
      img.src = url;
      return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('图片加载失败'));
      });
    }
    return url;
  }

  async drawImage(ctx, config, canvas) {
    if (!config.url) {
      // eslint-disable-next-line
      return console.error('图片不能为空', config)
    }

    const img = await this.loadImage(config.url, canvas);
    await this.execDrawImage(ctx, config, img);
  }

  handleDrawText(ctx, config) {
    if (config.text instanceof Array) {
      const textArr = config.text;
      delete config.text;
      textArr.map(textObj => {
        const newConfig = Object.assign({}, config, textObj);
        const { left, textWidth, margin = 0 } = this.drawText(ctx, newConfig);
        config.left = config.textAlign === 'right' ? left - textWidth - margin : left + textWidth + margin;
      });
    } else {
      this.drawText(ctx, config);
    }
  }

  drawText(ctx, config) {
    let {
      text,
      fontSize = 20,
      fontWeight,
      textDecoration,
      lineHeight,
      maxRow = 10,
      maxWidth = 375,
      paddingTop = 0,
      paddingRight = 0,
      paddingLeft = 0,
      ellipsis = true,
      top,
      left,
      margin = 0,
      color,
      textAlign,
      baseline = 'top'
    } = config;
    lineHeight = lineHeight || fontSize * 1.5;
    ctx.save();
    ctx.textAlign = textAlign;
    ctx.fillStyle = color;
    // 这里直接写死 ctx.textBaseline，后面会根据 baseline 重新计算Y轴的值;
    ctx.textBaseline = 'middle';
    ctx.font = fontWeight === 'bold' ? `bold ${fontSize}px/${lineHeight}px sans-serif` : `${fontSize}px/${lineHeight}px sans-serif`;

    const textArr = [];
    for (let i = 0; i < text.length; i++) {
      const textLine = (textArr[Math.max(textArr.length - 1, 0)] || '') + text[i];
      const { width: textWidth } = ctx.measureText(textLine);
      const index = Math.max(textWidth > maxWidth ? textArr.length : textArr.length - 1, 0);
      textArr[index] = (textArr[index] || '') + text[i];
    }

    if (textArr.length > maxRow) {
      textArr.length = maxRow;
      if (ellipsis) {
        textArr[maxRow - 1] = textArr[maxRow - 1].slice(0, -2) + '...';
      }
    }

    // 画文字背景和边框
    this.drawTextBackgroundAndBorder(ctx, { ...config, lineHeight }, textArr);

    let textWidth = 0;
    textArr.forEach((item, index) => {
      const x = textAlign === 'right' ? (left - margin) : (left + margin);
      let y = top + index * lineHeight;
      if (baseline === 'top') {
        y = top + index * lineHeight + lineHeight / 2;
      } else if (baseline === 'bottom') {
        y = top + index * lineHeight - lineHeight / 2;
      }
      // #ifdef H5
      // 真机画文字会有误差，暂时微调解决
      if (!/wechatdevtools/.test(navigator.userAgent)) {
        y = y - 2;
      }
      // #endif
      const { width } = ctx.measureText(item);
      textWidth = width;
      ctx.fillText(item || '', x + paddingLeft, y + paddingTop);
      if (textDecoration === 'line-through') {
        const lineConfig = {
          startX: x - 2,
          startY: y,
          endX: left + textWidth + 6,
          endY: y,
          strokeStyle: color
        };
        this.drawLine(ctx, lineConfig);
      }
    });
    ctx.restore();

    return { ...config, textWidth: textWidth + paddingLeft + paddingRight };
  }

  // 画文字背景和边框
  drawTextBackgroundAndBorder(ctx, config, textArr) {
    let {
      backgroundColor,
      textAlign,
      left,
      top,
      margin = 0,
      paddingTop = 0,
      paddingLeft = 0,
      paddingRight = 0,
      paddingBottom = 0,
      borderRadius = 0,
      lineHeight,
      borderColor,
    } = config;

    const newConfig = {
      top,
      left: textAlign === 'right' ? (left - margin) : (left + margin),
      width: Math.max.apply(Math, textArr.map(item => ctx.measureText(item).width)) + paddingLeft + paddingRight,
      height: textArr.length * lineHeight + paddingTop + paddingBottom,
    };

    if (backgroundColor) {
      this.drawBackground(ctx, {
        ...newConfig,
        color: backgroundColor,
        round: borderRadius,
      });
    }
    if (borderColor) {
      this.drawBorder(ctx, { ...config, ...newConfig });
    }
  }

  // 画圆角矩形
  drawRadiusRect(ctx, config) {
    const { left, top, width, height, borderRadius } = config;
    const br = borderRadius / 2;
    ctx.beginPath();
    ctx.moveTo(left + br, top);    // 移动到左上角的点
    ctx.lineTo(left + width - br, top);
    ctx.arc(left + width - br, top + br, br, 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4));
    ctx.lineTo(left + width, top + height - br);
    ctx.arc(left + width - br, top + height - br, br, 0, 2 * Math.PI * (1 / 4));
    ctx.lineTo(left + br, top + height);
    ctx.arc(left + br, top + height - br, br, 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4));
    ctx.lineTo(left, top + br);
    ctx.arc(left + br, top + br, br, 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4));
  }

  // 画边框
  drawBorder(ctx, config) {
    const {
      width,
      top,
      left,
      height,
      borderRadius,
      borderColor,
      borderWidth = 1,
    } = config;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    if (borderRadius) {
      // 画圆角矩形边框
      this.drawRadiusRect(ctx, config);
    } else {
      ctx.strokeRect(left, top, width, height);
    }
    ctx.stroke();
  }

  drawLine(ctx, config) {
    const { startX, startY, endX, endY, strokeStyle, dash } = config;
    ctx.save();
    ctx.beginPath();
    dash && ctx.setLineDash(dash, 0);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.restore();
  }

  clipRound(ctx, config) {
    const { round, width, height, left, top } = config;
    if (round) {
      const minSize = Math.min(width, height);
      const r = (round > minSize / 2) ? minSize / 2 : round;
      ctx.beginPath();
      ctx.moveTo(left + r, top);
      ctx.arcTo(left + width, top, left + width, top + height, r);
      ctx.arcTo(left + width, top + height, left, top + height, r);
      ctx.arcTo(left, top + height, left, top, r);
      ctx.arcTo(left, top, left + width, top, r);
      ctx.clip();
    }
  }

  drawBackground(ctx, config) {
    const { top, left, width, height, color } = config;
    ctx.save();
    this.clipRound(ctx, config);
    ctx.fillStyle = color;
    ctx.fillRect(left, top, width, height);
    ctx.restore();
  }

  drawCircle(ctx, config) {
    const { top, left, r, sAngle = 0, eAngle = 2 * Math.PI, counterclockwise = false, color = '#ffffff', alpha = 1 } = config;
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.arc(left, top, r, sAngle, eAngle, counterclockwise);
    ctx.fill();
    ctx.restore();
  }
}
