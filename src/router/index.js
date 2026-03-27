import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/Home/Home.vue'
import ChuanView from '@/views/Chuan/Chuan.vue'
import XiangView from '@/views/Xiang/Xiang.vue'
import LuView from '@/views/Lu/Lu.vue'
import ZhuView from '@/views/Zhu/Zhu.vue'
import LoginView from '@/views/Login/Login.vue'
import LayoutView from '@/views/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/layout',
      name: 'layout',
      component: LayoutView,
      // 默认home
      redirect: '/layout/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeView
        },
        {
          path: 'chuan',
          name: 'chuan',
          component: ChuanView
        },
        {
          path: 'xiang',
          name: 'xiang',
          component: XiangView
        },
        {
          path: 'lu',
          name: 'lu',
          component: LuView
        },
        {
          path: 'zhu',
          name: 'zhu',
          component: ZhuView
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]

})

export default router
