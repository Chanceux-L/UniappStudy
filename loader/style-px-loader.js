const loaderUtils = require('loader-utils')
// 默认参数
let defaultsProp = {
  baseDpr: 1,             // base device pixel ratio (default: 2)
  viewportUnit: 'rpx',
  minPixelValue: 1,
  precision: 2,        // precision (default: 6)
}
const template = /<template>([\s\S]+)<\/template>/gi
const ZPXRegExp = /(\d+)px/

module.exports = function (source) {
  const opts = loaderUtils.getOptions(this)
  const defaults = Object.assign({}, defaultsProp, opts)
  let _source = ''
  if (template.test(source)) {
    _source = source.match(template)[0]
  }
  let pxGlobalRegExp = new RegExp(ZPXRegExp.source, 'g')
  if (pxGlobalRegExp.test(_source)) {
    let $_source = _source.replace(pxGlobalRegExp, createPxReplace(defaults))
    return source.replace(template, $_source)
  } else {
    return source
  }
}

function createPxReplace({ minPixelValue, baseDpr, viewportUnit, precision }) {
  return function ($0, $1) {
    if (!$1) return
    const pixels = parseFloat($1)
    if (pixels <= minPixelValue) return $1 + 'px'
    return toFixed(pixels / baseDpr * 2, precision) + viewportUnit
  }
}

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier)
  return Math.round(wholeNumber / 10) * 10 / multiplier
}
