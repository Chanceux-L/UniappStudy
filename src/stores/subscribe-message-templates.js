import { Collection } from './helper/collection';
import { request } from '@/utils';

class SubscribeMessageTemplates extends Collection {
  fetch(params) {
    const { miniProgram } = uni.getAccountInfoSync();
    return request.get(`applications/${miniProgram.appId}/subscribe_message_templates`, {
      params, baseURL: '/wechat_mini_program_api'
    });
  }

  async subscribe(target) {
    const res = await uni.requestSubscribeMessage({ tmplIds: this.data.map(v => v.pri_tmpl_id) });
    const acceptIds = Object.keys(res).filter(id => res[id] === 'accept');
    const subscribeList = acceptIds.map(tmpl_id => {
      return {
        target_type: target.cn,
        target_id: target.id,
        subscribe_message_template_id: this.data.find(v => v.pri_tmpl_id === tmpl_id)?.id,
      };
    });
    if (acceptIds.length) {
      const { miniProgram } = uni.getAccountInfoSync();
      return request.post(
        `applications/${miniProgram.appId}/subscribe_message_templates/subscribe`,
        { subscribe: subscribeList }, { baseURL: '/wechat_mini_program_api' },
      );
    }
  }
}

export const subscribeMessageTemplates = new SubscribeMessageTemplates;
