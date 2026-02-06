import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import and register the Web Component
import './web-components/CustomerTable.js'

createApp(App).mount('#app')
