<template>
    <div id="header-temp">
        <div class="row full-width-row">
            <div class="col-sm-8">
                <div class="alert alert-primary no-border">
                    <h3>REST API - NODE - MYSQL - VUE - AXIOS</h3>
                </div>
            </div>
            <div class="col-sm-4 text-right">
                <div class="mt-3">
                    <router-link class="btn btn-primary btn-sm mr-1" v-if="isLoginActive" :to="{ name: 'rootRoute'}">Login</router-link>
                    <button class="btn btn-danger btn-sm" v-if="!isLoginActive" @click="logout()">Hi, {{ authUserFirstName }} - Logout?</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'appHeader',
    props: {

    },
    components: {

    },
    data() {
        return {
            
        }
    },
    computed: {
        isLoginActive() {
            return !this.$store.state.isLoggedIn && this.$store.state.authUser.name == undefined
        },
        authUserFirstName() {
            if (this.$store.state.isLoggedIn) {
                return this.$store.state.authUser.name.split(' ')[0]
            } else {
                return ''
            }
        }
    },
    watch: {

    },
    methods: {
        logout() {
            this.$store.commit('setPageLoading', true)
            this.$store.commit('setIsLoggedIn', false)
            this.$store.commit('setAuthUser', {})
            localStorage.removeItem(process.env.VUE_APP_BROWSER_STORAGE_KEY);
            this.$router.push({ name: 'rootRoute' })
        }
    },
    mounted() {

    }
}
</script>
