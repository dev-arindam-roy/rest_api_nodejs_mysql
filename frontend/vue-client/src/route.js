import { createRouter, createWebHistory } from "vue-router"

import store from './store/index'

import login from './components/login'
import members from './components/pages/members'
import viewMember from './components/pages/viewMember'
import addMember from './components/pages/addMember'

const routes = [
    {
        path: '/',
        component: login,
        name: 'rootRoute',
        meta: { middleware: 'login' }
    },
    {
        path: '/members',
        component: members,
        name: 'members',
        meta: { middleware: 'auth' }
    },
    {
        path: '/members/add',
        component: addMember,
        name: 'add.member',
        meta: { middleware: 'auth' }
    },
    {
        path: '/members/:hashid',
        component: viewMember,
        name: 'view.member',
        meta: { middleware: 'auth' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const checkAuth = store.state.isLoggedIn
    if (to.meta.middleware === 'auth') {
        if (!checkAuth) {
            router.push({ name: 'rootRoute' })
        } else {
            next()
        }
    } else if (to.meta.middleware === 'login') {
        if (checkAuth) {
            router.push({ name: 'members' })
        } else {
            next()
        }
    } else {
        next()
    } 
})

export default router;