const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  root: path.join(__dirname, "assignment"),
  publicDir: path.join(__dirname, "public"),
  build: {
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
        }
      }
    },
    outDir: path.join(__dirname, "dist"),
    emptyOutDir: true
  }
})
