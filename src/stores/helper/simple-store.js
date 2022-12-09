import Observable from './observable';

export class SimpleStore extends Observable {
  isFetching = false
  isRejected = false
  isFulfilled = false

  fetchData() {
    return Promise.resolve();
  }

  tryFetchData() {
    return !this.isFulfilled && this.fetchData(...arguments);
  }

  mergeFetched(handle) {
    return this.fetching(handle, true);
  }

  async fetching(handle, autoMerge = false) {
    this.isFetching = true;

    try {
      const res = await (typeof handle === 'function' ? handle() : handle);
      const newState = autoMerge ? (res.isResponse ? res.data : res) : void 0;
      Object.assign(this, {
        isFetching: false,
        isRejected: false,
        isFulfilled: true,
      }, newState);
      return res;
    } catch (err) {
      Object.assign(this, {
        isFetching: false,
        isRejected: true,
      });
      throw err;
    }
  }
}
