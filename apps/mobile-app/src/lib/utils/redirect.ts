function redirectTo(url: string) {
	if (!window.location.href.includes(url)) {
		window.location.assign(url);
	}
}

export { redirectTo };
