import { Capacitor } from '@capacitor/core';
import { readable, writable } from 'svelte/store';

import type { Locale } from '@/config';
import preferences from '@/utils/preferences';

const processing = writable(false);
const notifications = writable<string[]>(['hello']);
const showMenu = writable(true);
const errorMessage = writable<string>('');
const selfieUpdated = writable(false);

const locale = readable<Locale>('zh', (set) => {
	preferences.locale.get().then((res) => set(res));
});
const platform = readable<string>('web', (set) => {
	set(Capacitor.getPlatform());
});

export { processing, showMenu, errorMessage, locale, platform, notifications, selfieUpdated };
