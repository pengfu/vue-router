/**
 * 1 插件实现install 方法，Vue会将自身实例传进来
 * 2 mixin的地方，可以将从vue $options中获得的router实例挂在到Vue原型上
 * 3 重难点： router-view的实现，利用响应式数据！！！！！
 */
let Vue // 缓存下全局的Vue
class VueRouter {
  static install = (_Vue) => {
    Vue = _Vue
    Vue.mixin({
      beforeCreate() {
        // this指的是vue的实例
        if (this.$options.router) {
          Vue.prototype.$router = this.$options.router
        }
      },
    })

    Vue.component('router-view', {
      render(h) {
        console.log('---------this.$router---------', this.$router)
        let current = this.$router.vm.current
        let component = this.$router.getCurrentComponent(current)
        return h(component)
      },
    })

    Vue.component('router-link', {
      props: {
        to: String,
      },
      render(h) {
        console.log(h)
        // return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
        return <a href={`#${this.to}`}>{this.$slots.default}</a>
      },
    })
  }
  constructor(options) {  
    this.routes = options.routes
    this.init()
  }

  init() {
    // current 响应式
    this.vm = new Vue({
      data: {
        current: '',
      },
    })
    this.routeMap = this.genRouteMap()
    this.bindEvents()
  }

  genRouteMap = () => {
    let routeMap = {}
    this.routes.forEach((route) => {
      routeMap[route.path] = route.component
    })
    return routeMap
  }

  getCurrentComponent = (current) => {
    const routeMap = this.genRouteMap()
    return routeMap['/' + current]
  }

  bindEvents = () => {
    window.addEventListener('load', this.handleHash.bind(this))
    window.addEventListener('hashchange', this.handleHash.bind(this))
  }
  handleHash() {
    console.log('location.hash', location.hash)
    this.vm.current = location.hash.split('/')[1]
  }
}
export default VueRouter
