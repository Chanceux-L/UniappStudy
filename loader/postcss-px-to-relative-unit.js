const postcss = require('postcss')

const pxUnitReg = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/g

function toFixed(number, precision) {
  let multiplier = Math.pow(10, precision + 1)
  let wholeNumber = Math.floor(number * multiplier)
  return Math.round(wholeNumber / 10) * 10 / multiplier
}

function isExcludeFile(path, excludeFiles) {
  return excludeFiles.some(rule => path.match(rule))
}

function isExcludeSelector(selector, excludeSelectors) {
  return excludeSelectors.some(rule => {
    if (typeof rule === 'string') {
      return selector.indexOf(rule) !== -1
    }
    return selector.match(rule)
  })
}

function isExcludeProperty(property, excludeProperties) {
  return excludeProperties.some(rule => {
    if (typeof rule === 'string') {
      return property.indexOf(rule) !== -1
    }
    return property.match(rule)
  })
}

module.exports = postcss.plugin('postcss-px-to-relative-unit', function (options) {
  options = options || {}
  options = Object.assign({
    baseDpr: 1,
    targetUnit: 'rpx',
    ignoreThreshold: 1,
    viewportWidth: 375,
    viewportHeight: 667,
    htmlFontSize: 37.5,
    unitPrecision: 2,
    excludeFiles: [],
    excludeSelectors: [],
    excludeProperties: []
  }, options)
  return function (root) {
    if (isExcludeFile(root.source.input.file, options.excludeFiles)) {
      return
    }
    root.walkRules(rule => {
      if (isExcludeSelector(rule.selector, options.excludeSelectors)) {
        return
      }
      rule.walkDecls(decl => {
        if (isExcludeProperty(decl.prop, options.excludeProperties)) {
          return
        }
        let remValue = decl.value
        let vwValue = decl.value
        let rpxValue = decl.value

        if (options.targetUnit === 'vw') {
          decl.value = vwValue.replace(pxUnitReg, (match, pxValue) => {
            if (!pxValue) {
              return match
            }
            let pixelValue = parseFloat(pxValue)
            if (pixelValue <= options.ignoreThreshold) {
              return match
            }
            let vwTargetValue = toFixed(pixelValue / options.viewportWidth * 100, options.unitPrecision)
            return `${vwTargetValue}vw`
          })
        } else if (options.targetUnit === 'rem') {
          decl.value = remValue.replace(pxUnitReg, (match, pxValue) => {
            if (!pxValue) {
              return match
            }
            let pixelValue = parseFloat(pxValue)
            if (pixelValue <= options.ignoreThreshold) {
              return match
            }
            let remTargetValue = toFixed(pixelValue / options.htmlFontSize, options.unitPrecision)
            return `${remTargetValue}rem`
          })
        } else if (options.targetUnit === 'rpx') {
          decl.value = rpxValue.replace(pxUnitReg, (match, pxValue) => {
            if (!pxValue) {
              return match
            }
            let pixelValue = parseFloat(pxValue)
            if (pixelValue <= options.ignoreThreshold) {
              return match
            }
            let rpxTargetValue = toFixed(pixelValue / options.baseDpr * 2, options.unitPrecision)
            return `${rpxTargetValue}rpx`
          })
        }
      })
    })
  }
})
