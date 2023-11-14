// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'development'
        ? '/'
        : '/blockly-workspace',
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    ViteFonts({
      // google: {
      //   families: [{
      //     name: 'Roboto',
      //     styles: 'wght@100;300;400;500;700;900',
      //   }],
      // },
      custom: {
        /**
         * Fonts families lists
         */
        families: [{
          /**
           * Name of the font family.
           */
          name: 'Roboto',
          /**
           * Local name of the font. Used to add `src: local()` to `@font-rule`.
           */
          local: 'Roboto',
          /**
           * Regex(es) of font files to import. The names of the files will
           * predicate the `font-style` and `font-weight` values of the `@font-rule`'s.
           */
          src: './src/assets/fonts/Roboto/*.ttf',
        }],
      }   
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
