import { browser } from '$app/environment';
import { Preferences } from '@capacitor/preferences';

import type { Locale } from '@repo/shared/config';
import { DEFAULT_LOCALE } from '@/config';

function makePreference<T extends string>(key: string, defaultValue: T) {
	return {
		async set(value: T) {
			await Preferences.set({
				key,
				value
			});
		},
		async get() {
			if (!browser) return defaultValue;
			const { value } = await Preferences.get({ key });
			if (!value) {
				console.log(`no ${key} found, generating one with default value: ${defaultValue}`);
				await this.set(defaultValue);
				return defaultValue;
			}
			return value as T;
		},
		async remove() {
			await Preferences.remove({ key });
		}
	};
}

const locale = makePreference<Locale>('locale', DEFAULT_LOCALE);

export { locale };
