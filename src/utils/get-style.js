import _ from 'lodash';

const PX_PROPS = [
  'width',
  'height',
  'fontSize',
  'lineHeight',
  'paddingRight',
  'paddingLeft',
  'paddingTop',
  'paddingBottom',
  'marginRight',
  'marginLeft',
  'marginTop',
  'marginBottom',
  'borderTopWidth',
  'borderRadius',
  'top',
  'left',
  'bottom',
  'right'
];

const CSS_PROPS = PX_PROPS.concat(['backgroundColor', 'boxSizing', 'color', 'fontWeight', 'textAlign', 'borderColor', 'alignItems']);

export const getStyle = (config) => {
  return _.mapValues(
    _.pick(config, CSS_PROPS),
    (v, key) => {
      return PX_PROPS.includes(key) ? v * 2 + 'rpx' : v;
    }
  );
};
