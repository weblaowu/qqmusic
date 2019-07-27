import Vue from 'vue';
import router from './router';
import store from './store/index';
import App from './App';

// 引入全局样式
import './common/stylus/index.styl'

// 引入 vant 组件库 swipe
import { Swipe, SwipeItem } from 'vant';
Vue.use(Swipe).use(SwipeItem)
// 加载loading
import lazyLoad from 'vue-lazyload';
Vue.use(lazyLoad, {
  loading: require('./common/images/qq2.png')
})

// 解决移动端 300ms 延迟问题
import fastclick from 'fastclick'
fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h=> h(App)
}).$mount('#app')