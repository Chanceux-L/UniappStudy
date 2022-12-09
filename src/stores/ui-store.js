export default new class {
  systemInfo = {}

  constructor() {
    this.setSystemInfo();
  }

  setSystemInfo() {
    try {
      this.systemInfo = uni.getSystemInfoSync();
    } catch (error) {
      this.systemInfo = uni.getSystemInfoSync();
    } finally {
      this.systemInfo.platform || (this.systemInfo = uni.getSystemInfoSync());
    }
  }

  get isIOS() {
    const { platform } = this.systemInfo;
    if (platform) {
      return platform.toUpperCase() === 'IOS';
    } else {
      return false;
    }
  }
};
