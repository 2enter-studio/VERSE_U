import { browser } from '$app/environment';

function redirectTo(url: string) {
	if (!browser) return;
	if (!window.location.href.includes(url)) {
		window.location.assign(url);
	}
}

export { redirectTo };
