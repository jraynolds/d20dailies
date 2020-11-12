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
    path: '/speaking',
    name: 'Speaking Exercises',
    component: () => import('../views/SpeakingExercises.vue')
  },
  {
    path: '/accent',
    name: 'Accent Exercises',
    component: () => import('../views/AccentExercises.vue')
  },
  {
    path: '/description',
    name: 'Descriptive Exercises',
    component: () => import('../views/DescriptionExercises.vue')
  },
  {
    path: '/trolley',
    name: 'Trolley Problems',
    component: () => import('../views/TrolleyExercises.vue')
  },
  {
    path: '/combat',
    name: 'Combat Tests',
    component: () => import('../views/CombatTests.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
