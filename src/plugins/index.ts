/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'

// Types
import type { App } from 'vue'

// Pinia plugins
//import { localStoragePlugin } from '../store/app'

// pinia.use(localStoragePlugin);

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(pinia)
}
