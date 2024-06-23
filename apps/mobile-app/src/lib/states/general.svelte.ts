import { Capacitor } from '@capacitor/core';
import { DEFAULT_LOCALE, type Locale } from '@/config';
import ui_texts from '@/config/ui_texts';

function makeGeneralState() {
	let processing = $state(false);
	let showMenu = $state(true);
	let selfieUpdated = $state(false);
	let locale = $state<Locale>(DEFAULT_LOCALE);

	let errorMessage = $state<string>('');
	let notifications = $state<string[]>(['hello']);

	const uiTexts = $state.frozen(ui_texts[locale]);
	const platform = $state.frozen(Capacitor.getPlatform());

	return {
		get processing() {
			return processing;
		},
		get showMenu() {
			return showMenu;
		},
		get notifications() {
			return notifications;
		},
		get errorMessage() {
			return errorMessage;
		},
		get selfieUpdated() {
			return selfieUpdated;
		},
		get locale() {
			return locale;
		},
		get platform() {
			return platform;
		},
		get uiTexts() {
			return uiTexts;
		},
		set processing(value) {
			processing = value;
		},
		set showMenu(value) {
			showMenu = value;
		},
		set notifications(value) {
			notifications = value;
		},
		set errorMessage(value) {
			errorMessage = value;
		},
		set selfieUpdated(value) {
			selfieUpdated = value;
		},
		set locale(value) {
			locale = value;
		}
	};
}

let general = makeGeneralState();

export { general };
