const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');
const ci = require(
  path.join(
    process.execPath.replace(/bin\/node$/, ''),
    '.npm/lib/node_modules/miniprogram-ci',
  )
);

const config = {
  version: dayjs().format('YYMMDDTHH'),
  env: process.env.VUE_APP_ENV,
};

function getAppId() {
  const manifestPath = path.resolve(__dirname, '../src/manifest.json');
  const reg = /(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g; // 删除注释
  const manifest = fs.readFileSync(manifestPath, 'utf8').replace(reg, '');
  return JSON.parse(manifest)['mp-weixin'].appid;
}

async function deployMpWeixin(desc, version = config.version) {
  const desc_str = desc || config.env;
  const projectPath = path.resolve('dist/build/mp-weixin');
  const privateKeyPath = path.resolve('script/wx.key');
  const appid = getAppId();

  const project = new ci.Project({
    appid, type: 'miniProgram',
    projectPath, privateKeyPath,
    ignores: ['node_modules/**/*'],
    setting: {
      // 用到了第三方组件(没转码的比如 to-wxml)，需要打开es6转es5开关
      // es6: true,
      minifyWXSS: true
    }
  });

  try {
    await ci.upload({
      project, version,
      desc: desc_str,
      robot: process.env.WX_CI_ROBOT,
      onProgressUpdate: console.log,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = deployMpWeixin;
