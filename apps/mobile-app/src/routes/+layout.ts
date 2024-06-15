import { updateActiveStatus } from '@/utils/auth';
import type { Load } from '@sveltejs/kit';
import { loggedIn, setAuth } from '@/stores';
import { get } from 'svelte/store';

export const prerender = true;
export const ssr = false;

export const load: Load = async () => {
	if (!get(loggedIn)) {
		await setAuth();
		console.log(get(loggedIn) ? 'logged in' : 'not logged in');
		// redirect(302, '/');
	}
	// const result = await updateActiveStatus();
	// if (result?.error) console.error(result.error);
	return {};
};
