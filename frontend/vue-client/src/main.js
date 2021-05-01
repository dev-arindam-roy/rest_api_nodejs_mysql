import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/app.css'

import router from './route'
import store from './store/index'

import Toaster from '@meforma/vue-toaster';
const toasterConfig = {
    position: 'top-right',
    duration: 5000,
    queue: true
}

const app = createApp(App)
app.use(Toaster, toasterConfig)
app.use(router)
app.use(store)
app.mount('#app')
