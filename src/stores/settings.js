import { SimpleStore } from './helper/simple-store';
import { request } from '@/utils';

class Settings extends SimpleStore {
  fetchData() {
    return this.mergeFetched(request.get('settings'));
  }
}

export const settings = Settings.create();
