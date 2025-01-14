/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-svelte', require('daisyui')],
	daisyui: {
		themes: ['dark', 'sunset']
	}
};
