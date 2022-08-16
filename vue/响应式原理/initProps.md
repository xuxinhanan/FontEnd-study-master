~~~js
  function initProps (vm: Component, propsOptions: Object) {
    const propsData = vm.$options.propsData || {}
    const props = vm._props = {}
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    const keys = vm.$options._propKeys = []
    const isRoot = !vm.$parent
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false)
    }
    for (const key in propsOptions) {
      keys.push(key)
      const value = validateProp(key, propsOptions, propsData, vm)
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        const hyphenatedKey = hyphenate(key)
        if (isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)) {
          warn(
            `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
            vm
          )
        }
        defineReactive(props, key, value, () => {
          if (vm.$parent && !isUpdatingChildComponent) {
            warn(
              `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
              vm
            )
          }
        })
      } else {
        defineReactive(props, key, value)
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, `_props`, key)
      }
    }
    toggleObserving(true)
  }
~~~

