export function showToast(params) {
  const options = {
    title: '',
    icon: 'none',
    mask: true,
    duration: 1500,
  };
  if (typeof params === 'string') {
    Object.assign(options, { title: params });
  } else {
    Object.assign(options, params);
  }
  uni.showToast(options);
  return new Promise(resolve => setTimeout(resolve, options.duration));
}

export function showLoading(params) {
  const options = {
    title: '',
    mask: true,
  };
  if (typeof params === 'string') {
    Object.assign(options, { title: params });
  } else {
    Object.assign(options, params);
  }
  return uni.showLoading(options);
}

export const alert = (content, opts = {}) => {
  return uni.showModal({
    content,
    confirmText: '我知道了',
    showCancel: false,
    ...opts
  });
};

export const confirm = async (content, opts = {}) => {
  const { confirm } = await uni.showModal({
    content,
    confirmText: '确认',
    showCancel: true,
    cancelText: '取消',
    ...opts
  });
  if (!confirm) {
    return Promise.reject(new Error('用户取消'));
  }
};

export function autoLoadingDecorator(target, name, descriptor) {
  const func = descriptor.value;
  descriptor.value = function () {
    return autoLoading(func.apply(this, arguments));
  };
}

autoLoadingDecorator.retry = function(target, name, descriptor) {
  const func = descriptor.value;
  descriptor.value = function () {
    return autoLoading(() => func.apply(this, arguments), { isRetry: true });
  };
};

export function autoLoading(target, options = {}) {
  const action = target instanceof Function ? target() : target;
  // 不是promise时就不要loading
  if (!(action instanceof Promise)) {
    return action;
  }
  showLoading(options.loadingText || '加载中');
  return action
    .finally(() => {
      uni.hideLoading();
    })
    .catch(err => {
      if (options.isRetry) {
        handleRetry(err, target, options);
      } else {
        errHandle(err);
      }
    });
}

export function pageRefresh(target, name, descriptor) {
  const func = descriptor.value;
  descriptor.value = async function () {
    try {
      await func.apply(this, arguments);
    } catch (err) {
      errHandle(err);
    } finally {
      uni.stopPullDownRefresh();
    }
  };
}

function handleRetry(err, target, options) {
  const ignoreErrors = /(cancel|ignore|请先登录)/i;
  const msg = err.message || err.errMsg;
  if (msg && !ignoreErrors.test(msg)) {
    return uni.showModal({
      title: '提示',
      content: msg,
      confirmText: '重试'
    }).then(({ confirm }) => {
      if (confirm) {
        return autoLoading(target, options);
      }
    });
  }
  throw err;
}

export function errToast(target, name, descriptor) {
  const func = descriptor.value;
  descriptor.value = function () {
    return func.apply(this, arguments).catch(err => {
      uni.hideLoading();
      errHandle(err);
    });
  };
}

export function errHandle(err) {
  const ignoreErrors = /(cancel|ignore|请先登录)/i;
  const timeoutErrors = /(request:fail timeout)|(timeout.*\d+ms)/i;
  let msg = err.message || err.errMsg;
  msg = err.status >= 500 || timeoutErrors.test(msg) ? '网络开小差了，请稍后再试' : msg;
  if (!ignoreErrors.test(msg)) {
    msg && alert(msg, {
      title: '提示',
    });
  }
  throw err;
}

// 点击触发异步事件锁，不使用autoLoading的时候代替
export function clickLockDecorator(target, name, descriptor) {
  const func = descriptor.value;
  descriptor.value = async function () {
    if (this.$lock) {
      return;
    }
    this.$lock = true;
    try {
      await func.apply(this, arguments);
    } finally {
      this.$lock = false;
    }
  };
}

