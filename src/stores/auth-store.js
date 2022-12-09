import { SimpleStore } from './helper/simple-store';
import Observable from './helper/observable';
import { ACCESS_TOKEN_KEY, UPDATE_USER_INFO_KEY } from '@/constants';
import { request, Storage } from '@/utils';

class User extends Observable {
  nickname = ''
  avatar = ''

  get wechat_authorized() {
    return this.avatar && this.nickname;
  }
}

class AuthStore extends SimpleStore {
  constructor(...ags) {
    super(...ags);
    // 7天更新一次用户信息
    this.updateUserInfoStorage = new Storage(UPDATE_USER_INFO_KEY, 7 * 24 * 60 * 60 * 1000);
    this.hasUpdateWechatUserInfo = this.updateUserInfoStorage.get(UPDATE_USER_INFO_KEY);
  }

  $access_token = uni.getStorageSync(ACCESS_TOKEN_KEY)
  user = User.create()

  set access_token(v) {
    this.$access_token = v;
    uni.setStorageSync(ACCESS_TOKEN_KEY, v);
  }

  get access_token() {
    return this.$access_token;
  }

  async checkLogin() {
    if (this.access_token) {
      try {
        await uni.checkSession();
        return this.access_token;
      } catch (e) {
        return this.login();
      }
    }
    return this.login();
  }

  async login() {
    // 防止多个api同时 401 导致多次调用 login
    if (!this.loginPromise) {
      const { code } = await uni.login();
      this.loginPromise =  request.post('/auth/wechat_mini_program/code_to_sessions', {
        code
      }).finally(() => {
        this.loginPromise = null;
      });
    }
    const { data: { token, user } } = await this.loginPromise;
    this.user = User.create(user);
    return this.access_token = token;
  }

   /**
   * 获取个人信息并更新
   * @param { Boolean } showError 是否需要抛出异常
   * @param { String } desc 声明获取用户个人信息后的用途，不超过30个字符
  */
  async getUserProfile(showError, desc) {
    if (typeof uni.getUserProfile !== 'function' || this.hasUpdateWechatUserInfo) {
      return;
    }
    let userInfo = '';
    desc = desc || '更新个人信息';
    try {
      const res = await uni.getUserProfile({ desc });
      userInfo = res;
    } catch (error) {
      if (showError) {
        throw new Error('获取用户信息失败');
      }
      // 用户取消授权，直接退出
      if (error.errMsg === 'getUserProfile:fail auth deny') {
        return '';
      }
    }
    return userInfo;
  }

  // 更新微信小程序用户信息
  async updateWechatUserInfo(body, showError, desc) {
    if (!this.hasUpdateWechatUserInfo) {
      body = body || await this.getUserProfile(showError, desc);
      const { encryptedData, iv } = body;
      await request.post('auth/wechat_mini_program/sns_authorization', { encrypted_data: encryptedData, iv });
      this.hasUpdateWechatUserInfo = true;
      this.updateUserInfoStorage.set(UPDATE_USER_INFO_KEY, true);
    }
  }
}

export const authStore = new AuthStore();
