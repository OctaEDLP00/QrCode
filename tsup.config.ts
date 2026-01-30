import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'iife'],
  globalName: 'QRCode',
  dts: true,
  bundle: true,
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  tsconfig: './tsconfig.json',
  outExtension({ format }) {
    return {
      js: format === 'iife' ? '.browser.js' : '.mjs',
    }
  }
})
