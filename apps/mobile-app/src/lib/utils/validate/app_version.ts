function app_version(version: string) {
	return version.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
}

export { app_version };
