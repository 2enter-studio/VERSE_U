// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type FormDataResponse = {
		type: 'error' | 'success';
		message: string;
		detail?: string;
		data?: any;
	};
}

export {};
