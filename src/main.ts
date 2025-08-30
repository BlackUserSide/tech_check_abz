import {createApp} from 'vue'
import './scss/main.scss'
import App from './App.vue'
import {createPinia} from "pinia";
import VueTheMask from 'vue-the-mask'
import 'notyf/notyf.min.css';

const app = createApp(App)
app.use(createPinia())
app.use(VueTheMask)
app.mount('#app')
