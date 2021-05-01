<template>
    <div id="login-temp">
        <div class="container">
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <div class="mt-5">
                        <h3 class="text-center">Member's Login</h3>
                        <div class="card mt-4">
                            <form @submit.prevent="loginSubmit()" method="POST">
                                <div class="card-body">
                                    <div class="form-group">
                                        <label>Email-id:</label>
                                        <input type="text" v-model.trim="email" class="form-control" placeholder="Email Address">
                                        <div class="text-danger" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</div>
                                    </div>
                                    <div class="form-group">
                                        <label>Password:</label>
                                        <input type="password" v-model.trim="password" class="form-control" placeholder="Password">
                                        <div class="text-danger" v-if="v$.password.$error">{{ v$.password.$errors[0].$message }}</div>
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" :disabled="isDisabled" class="btn btn-primary">Login</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4"></div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../plugins/axios'

import useVuelidate from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

export default {
    setup () {
        return { v$: useVuelidate() }
    },
    name: 'appLogin',
    props: {

    },
    components: {

    },
    data() {
        return {
            email: '',
            password: ''
        }
    },
    computed: {
        isDisabled() {
            return this.email == '' || this.password == '';
        }
    },
    watch: {

    },
    validations() {
        return {
            email: { 
                required: helpers.withMessage('Please enter email address', required),
                email: helpers.withMessage('Please enter an valid email address', email)
            },
            password: { 
                required: helpers.withMessage('Please enter password', required)
            }
        }
    },
    methods: {
        loginSubmit() {
            this.v$.$validate()
            if (!this.v$.$error) {
                this.$store.commit('setPageLoading', true)
                this.loginSubmitProcess()
            }
        },
        async loginSubmitProcess() {
            var _this = this;
            await axios({
                method: 'POST',
                url: '/auth/login',
                data: {
                    email: this.email,
                    password: this.password
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if (response.status === 200 && response.data.isSuccess === 1) {
                    let apiContent = response.data.content
                    _this.getAuthUser(apiContent.token)
                }
            })
            .catch(function (error) {
                _this.$store.commit('setPageLoading', false)
                _this.$toast.error(error.response.data.error_msg)
            })
        },
        async getAuthUser(authToken) {
            var _this = this;
            _this.$store.commit('setPageLoading', true)
            await axios({
                method: 'POST',
                url: '/users/token',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(function (response) {
                if (response.status === 200 && response.data.isSuccess === 1) {
                    localStorage.setItem(process.env.VUE_APP_BROWSER_STORAGE_KEY, authToken);
                    _this.$store.commit('setIsLoggedIn', true)
                    _this.$store.commit('setAuthUser', response.data.content.auth_user)
                    _this.$toast.success('Authentication ok! Login has been done')
                    setTimeout( function() { 
                        _this.$router.push({ 'name' : 'members' })
                    }, 3000);
                } else {
                    _this.$toast.error('Something went wrong! please try again')
                    _this.destroyStorageToken()
                    window.location.href = '/'
                }
            })
            .catch(function (error) {
                _this.destroyStorageToken()
                _this.$store.commit('setPageLoading', false)
                _this.$toast.error(error.response.data.error_msg)
            })
        },
        isAuthTokenExist() {
            const _storageToken = localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY)
            if (_storageToken != undefined && _storageToken != '' && _storageToken != null) {
                this.getAuthUser(_storageToken)
            }
        },
        destroyStorageToken() {
            this.$store.commit('setIsLoggedIn', false)
            this.$store.commit('setAuthUser', {})
            localStorage.removeItem(process.env.VUE_APP_BROWSER_STORAGE_KEY)
        }
    },
    mounted() {
        this.$store.commit('setPageLoading', false)
        this.isAuthTokenExist()
    }
}
</script>
