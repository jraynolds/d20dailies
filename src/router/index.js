import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/roleplaying',
    name: 'Roleplaying Exercises',
    component: () => import('../views/Roleplaying.vue')
  },
  {
    path: '/accent',
    name: 'Accent Exercises',
    component: () => import('../views/Accent.vue')
  },
  {
    path: '/description',
    name: 'Descriptive Exercises',
    component: () => import('../views/Description.vue')
  },
  {
    path: '/morality',
    name: 'Trolley Problems',
    component: () => import('../views/Morality.vue')
  },
  {
    path: '/tactics',
    name: 'Tactics',
    component: () => import('../views/Tactics.vue')
  },
  {
    path: '/persuasion',
    name: 'Persuasion',
    component: () => import('../views/Persuasion.vue')
  },
  {
    path: '/dungeon',
    name: 'Dungeon',
    component: () => import('../views/Dungeon.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
