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
	},
	onSuccess: async () => {
		const filesToCopy = ['README.md', 'LICENSE', 'package.json']
		await Promise.all(
			filesToCopy.map(async file => {
				try {
					const srcPath = resolve(process.cwd(), file)
					const destPath = resolve(process.cwd(), 'dist', file)
					await copyFile(srcPath, destPath)
					console.log(`Copied ${file} to dist/`)
				} catch (error) {
					console.warn(`Warning: Could not copy ${file}`, error)
				}
			})
		)
	},
})
