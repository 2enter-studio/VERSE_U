// import { updateActiveStatus } from '@/utils/auth';
import type { Load } from '@sveltejs/kit';
import { auth } from '../lib/states';

export const prerender = true;
export const ssr = false;

export const load: Load = async () => {
	if (!auth.loggedIn) {
		await auth.set();
		console.log(auth.loggedIn ? 'logged in' : 'not logged in');
		// redirect(302, '/');
	}
	// const result = await updateActiveStatus();
	// if (result?.error) console.error(result.error);
	return {};
};
