import { defineConfig } from 'vite';
import vituum from 'vituum';
import twig from '@vituum/vite-plugin-twig';
import path from 'node:path';
import dataSite from './src/data/site';
import { listHtml, getFileName } from './src/data/app.config';

export default defineConfig({
	plugins: [
		vituum({
			pages: {
				dir: './src/views'
			},
			imports: {
				paths: []
			}
		}),
		twig({
			root: './src',
			globals: {
				site: dataSite,
			},
			functions: {
				listHtml: () => listHtml,
			},
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(process.cwd(), 'src'),
			'scripts': path.resolve(process.cwd(), 'src', 'scripts'),
			'styles': path.resolve(process.cwd(), 'src', 'styles'),
		},
	},
	build: {
		manifest: false,
		assetsInlineLimit: 0,
		modulePreload: false,
		rollupOptions: {
			input: [
				'./src/views/**/*.{json,twig,html}',
				'!./src/views/**/*.twig.json',
				'./src/scripts/*.{js,ts,mjs}'
			],
			output: {
				entryFileNames: 'assets/js/[name].js',
				chunkFileNames: 'assets/js/[name].js',
				assetFileNames: getFileName,
			},
		},
	},
});
