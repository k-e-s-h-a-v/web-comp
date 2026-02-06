import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // Treat customer-table as a custom element
                    isCustomElement: (tag) => tag === 'customer-table'
                }
            }
        })
    ]
})
