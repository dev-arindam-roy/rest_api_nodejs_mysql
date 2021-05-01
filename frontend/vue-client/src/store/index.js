import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            isPageLoadingActive: false,
            isLoggedIn: false,
            authUser: {}
        }
    },
    mutations: {
        setIsLoggedIn (state, payload) {
            state.isLoggedIn = payload
        },
        setAuthUser (state, payload) {
            state.authUser = payload
        },
        setPageLoading (state, payload) {
            state.isPageLoadingActive = payload
        }
    }
})

export default store;