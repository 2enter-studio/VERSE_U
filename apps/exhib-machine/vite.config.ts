import 'dotenv/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const { PORT } = process.env;

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/ws': {
				target: `http://127.0.0.1:${PORT}`,
				ws: true
			}
		},
		port: 5175
	}
});
