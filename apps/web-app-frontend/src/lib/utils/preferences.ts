import { browser } from '$app/environment';
import { Preferences } from '@capacitor/preferences';

import { type Locale, LOCALES } from '@repo/shared/config';
import { DEFAULT_LOCALE } from '@/config';
import { sysState } from '@/states';

class MyPreference<T extends string | number> {
	key: keyof typeof sysState.pref;
	defaultValue: T;
	validate: (value: T) => boolean;

	constructor(key: keyof typeof sysState.pref, defaultValue: T, validate: (value: T) => boolean) {
		this.key = key;
		this.defaultValue = defaultValue;
		this.validate = validate;
	}

	async set(value: T) {
		if (!this.validate(value)) {
			console.error(`${value} can not pass the validation`);
			return;
		}

		await Preferences.set({
			key: this.key,
			value: value.toString()
		});

		// @ts-ignore
		sysState.pref[this.key] = value;
	}
	async get() {
		if (!browser) return this.defaultValue;
		const { value } = await Preferences.get({ key: this.key });
		if (!value) {
			console.log(`no ${this.key} found, generating one with default value: ${this.defaultValue}`);
			await this.set(this.defaultValue);
			return this.defaultValue;
		}
		if (typeof this.defaultValue === 'string') return value as T;
		else return Number(value) as T;
	}
	async remove() {
		await Preferences.remove({ key: this.key });
	}
}

const locale = new MyPreference<Locale>('locale', DEFAULT_LOCALE, (value) =>
	LOCALES.includes(value)
);
const music_volume = new MyPreference<number>(
	'music_volume',
	50,
	(value) => value >= 0 && value <= 100
);
const sound_volume = new MyPreference<number>(
	'sound_volume',
	50,
	(value) => value >= 0 && value <= 100
);

type MyPref = {
	locale: Locale;
	music_volume: number;
	sound_volume: number;
};

export { locale, music_volume, sound_volume };
export type { MyPref };
