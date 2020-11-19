import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import { auth } from "@/plugins/firebase"

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
		component: () => import('../views/Account.vue'),
		meta: {
			requiresAuth: true
		}
  },
  {
    path: '/roleplaying',
    name: 'Roleplaying Exercises',
    component: () => import('../views/Roleplaying.vue'),
		meta: {
			requiresAuth: true
		}
  },
  {
    path: '/accent',
    name: 'Accent Exercises',
    component: () => import('../views/Accent.vue'),
		meta: {
			requiresAuth: true
		}
  },
  {
    path: '/description',
    name: 'Descriptive Exercises',
    component: () => import('../views/Description.vue'),
		meta: {
			requiresAuth: true
		}
  },
  {
    path: '/morality',
    name: 'Trolley Problems',
    component: () => import('../views/Morality.vue'),
		meta: {
			requiresAuth: true
		}
  },
  {
    path: '/tactics',
    name: 'Tactics',
    component: () => import('../views/Tactics.vue'),
		meta: {
			requiresAuth: true
		}
  },
  {
    path: '/persuasion',
    name: 'Persuasion',
    component: () => import('../views/Persuasion.vue'),
		meta: {
			requiresAuth: true
		}
  },
  {
    path: '/dungeon',
    name: 'Dungeon',
    component: () => import('../views/Dungeon.vue'),
		meta: {
			requiresAuth: true
		}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
	let requiresAuth = to.matched.some(x => x.meta.requiresAuth);
	if (requiresAuth && !auth.currentUser) {
		next('/login');
	} else {
		next();
	}
})

export default router
