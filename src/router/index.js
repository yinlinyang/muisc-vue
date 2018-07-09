import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/Recommend/Recommend'
import Singer from 'components/Singer/Singer'
import Rank from 'components/Rank/Rank'
import Search from 'components/Search/Search'
import User from 'components/User/User'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/user',
      name: 'User',
      component: User
    }
  ]
})
