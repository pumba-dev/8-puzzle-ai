import { createApp } from 'vue'
import App from './App.vue'

import './styles/global.scss'
// import './styles/reset.scss'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(Antd)

app.mount('#app')
