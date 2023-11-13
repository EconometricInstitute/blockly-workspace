/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Store 
import { useAppStore } from '@/store/app';

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

// Initialize from localStorage
const store = useAppStore();
store.loadLocalStorage();