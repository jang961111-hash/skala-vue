import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 🟢 Element Plus 모듈 및 필수 CSS Import (교재 236p)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus) // 🟢 Vue 앱에 Element Plus 사용 등록

app.mount('#app')
