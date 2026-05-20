import { defineConfig, esmExternalRequirePlugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

const peerDeps = ['react', 'react-dom', 'react/jsx-runtime', 'react-intl']

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/guillo-gmi'],
      outDirs: 'dist',
      bundleTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/guillo-gmi/index.ts'),
      name: 'ReactGMI',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'react-gmi.modern.js'
        if (format === 'cjs') return 'react-gmi.js'
        return `react-gmi.${format}.js`
      },
    },
    rolldownOptions: {
      // esmExternalRequirePlugin replaces __require("react") with ESM imports (needed for Vite 8 consumers).
      plugins: [
        esmExternalRequirePlugin({
          external: peerDeps,
        }),
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react-intl': 'ReactIntl',
        },
        preserveModules: false,
      },
    },
    sourcemap: true,
    minify: false,
  },
})
