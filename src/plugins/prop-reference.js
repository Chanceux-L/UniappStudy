import { Prop } from 'vue-property-decorator';

let refCount = 0;
const refIdList = new Map(); // 缓存引用对象的 id，用于快速获取 id
const refList = {}; // 缓存引用对象，用于通过 id 快速获取对象

export default function install(Vue) {
  Vue.mixin({
    created() {
      this.$refIds = []; // 当前组件生成的引用 id，组件删除时需要从缓存中删除对应的项
    },

    destroyed() {
      refIdList.forEach((id, reference) => {
        if (this.$refIds.includes(id)) {
          refIdList.delete(reference);
          delete refList[id];
        }
      });
    },

    methods: {
      $getRefId(value) {
        if (!refIdList.has(value)) {
          const id = String(++refCount);
          this.$refIds.push(id);
          refIdList.set(value, id);
          refList[id] = value;
        }
        return refIdList.get(value);
      },
    }
  });
}

export function PropReference(options) {
  const { type, default: getDefault = () => null, required } = options;
  return (target, name, descriptor) => {
    // #ifdef MP-WEIXIN || APP-PLUS
    const idPropName = name + 'Id';
    Prop({ type: String, required })(target, idPropName, descriptor);

    Object.defineProperty(target, name, {
      get() {
        const ref = refList[this[idPropName]];
        if (ref !== undefined) {
          if (!(ref instanceof type) && ref !== null) {
            // eslint-disable-next-line no-console
            console.warn(`name is not a ${type.name}`);
          }
          return ref;
        }
        return getDefault();
      }
    });
    // #endif

    // #ifdef H5
    Prop(options)(target, name, descriptor);
    // #endif
  };
}
