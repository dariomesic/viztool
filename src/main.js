import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia'
import Modal from './popups/Popup'
import LoadingScreen  from './popups/Loading'

import './css/Component.css'
import './css/ComponentStyle.css'
import './css/Popups.css'

const pinia = createPinia()

createApp(App).use(router).use(pinia).component("Modal",Modal).component("Loading",LoadingScreen).mount('#app')
