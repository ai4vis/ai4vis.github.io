import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import ant from "./utils/ant"

createApp(App)
    .use(store)
    .use(ant)
    .mount('#app')