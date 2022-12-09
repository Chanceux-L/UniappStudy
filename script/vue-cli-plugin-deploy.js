module.exports = api => {
  api.registerCommand('deploy:h5', {}, () => require('./deploy-h5')());
  api.registerCommand('deploy:mp-weixin', {}, () => require('./deploy-mp-weixin')());
};
