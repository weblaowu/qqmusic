import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@components/recommend/recommend'
import Singer from '@components/singer/singer'
import Rank from '@components/rank/rank'
import Search from '@components/search/search'
import SingerDetail from '@components/singer/singerDetail'
import RecomDetail from '@components/recommend/recomDetail'
import RankDetail from '@components/rank/rankDetail'
Vue.use(Router)
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      // 首屏显示 推荐页
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecomDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [ // singerDetail 
        {
          path: ':id', // 动态路由 
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id', // 动态路由 
          component: RankDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
  ]
})
