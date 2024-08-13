const APPS = [
	{
		name: 'mobile-app',
		port: 5173,
		framework: 'SvelteKit',
		svelteAdaptor: 'static',
		dbRelated: true,
		description:
			'The Verse U mobile app, which can be adapted into a static site or native mobile app.'
	},
	{
		name: 'assets-manager',
		port: 5174,
		framework: 'SvelteKit',
		svelteAdaptor: 'bun',
		dbRelated: true,
		description:
			'A web-based GUI interface allows staffs to easily manage assets like 3D models, textures, images, etc.'
	},
	{
		name: 'exhib-machine',
		port: 5175,
		framework: 'SvelteKit',
		svelteAdaptor: 'bun',
		dbRelated: true,
		description:
			'A server runs on the exhibit machine of Verse U Hai-An installation.'
	},
	{
		name: 'website',
		port: 5176,
		framework: 'SvelteKit',
		svelteAdaptor: 'node',
		dbRelated: true,
		description: 'The official website.'
	},
	{
		name: 'docs',
		port: 5177,
		framework: 'SvelteKit',
		svelteAdaptor: 'auto',
		dbRelated: false,
		description: 'This documentation page.'
	},
	{
		name: 'bots',
		port: null,
		framework: 'Bun',
		svelteAdaptor: null,
		dbRelated: true,
		description:
			'Periodically running tasks like cleaning trash data in database, updating player locations, and others.'
	}
] as const;

export { APPS };
