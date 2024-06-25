import { Capacitor } from '@capacitor/core';
import { DEFAULT_LOCALE, UI_TEXTS, type Locale } from '@/config';

class GeneralState {
	processing = $state(false);
	showMenu = $state(true);
	selfieUpdated = $state(false);
	locale = $state<Locale>(DEFAULT_LOCALE);

	errorMessage = $state<string>('');
	notifications = $state<string[]>(['hello']);

	readonly uiTexts = $state.frozen(UI_TEXTS[this.locale]);
	readonly platform = $state.frozen(Capacitor.getPlatform());
}

let generalState = new GeneralState();

export { generalState };
