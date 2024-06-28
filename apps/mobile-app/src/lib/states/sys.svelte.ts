import { inPeriod, type Prettify } from '@repo/shared/utils';
import { Capacitor } from '@capacitor/core';
import { DEFAULT_LOCALE, UI_TEXTS } from '@/config';
import type { Locale } from '@repo/shared/config';
import { v4 as uuid } from 'uuid';
import type { Tables } from '@repo/shared/supatypes';
import type { TextCode } from '@/config/ui_texts/types';

type SystemMessage = {
	id: string;
	created_at: Date;
	display?: 'popout' | 'side';
	type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'PROCESSING';
	message: string;
	callback?: Function;
};

class SystemState {
	processing = $state(false);
	showMenu = $state(true);
	selfieUpdated = $state(false);
	locale = $state<Locale>(DEFAULT_LOCALE);
	now = $state<Date>(new Date());

	remoteAppVersion = $state<Tables<'app_versions'> | null>(null);
	maintenance = $state<Tables<'maintenance'> | null>(null);

	systemMessage = $state<SystemMessage[]>([
		// {
		// 	id: uuid(),
		// 	created_at: new Date(),
		// 	display: 'side',
		// 	type: 'WARNING',
		// 	message: 'Fuck you',
		// 	callback: () => {
		// 		console.log('fuck you ');
		// 	}
		// }
	]);
	readonly uiTexts = $derived(UI_TEXTS[this.locale]);
	readonly platform = $state.frozen(Capacitor.getPlatform());
	readonly maintaining = $derived(
		inPeriod(this.maintenance?.start ?? 0, this.maintenance?.end ?? 0, this.now)
	);

	addSysMsg(input: Prettify<Omit<SystemMessage, 'created_at' | 'id'>>) {
		const result = { ...input, created_at: new Date(), id: uuid() };
		this.systemMessage.push(result);
		return result;
	}
	defaultError(message: TextCode) {
		return this.addSysMsg({
			type: 'ERROR',
			display: 'side',
			message: this.uiTexts[message]
		});
	}
	defaultSuccess(message: TextCode) {
		return this.addSysMsg({
			type: 'SUCCESS',
			display: 'side',
			message: this.uiTexts[message]
		});
	}
	defaultProcessing() {
		return this.addSysMsg({
			type: 'PROCESSING',
			display: 'side',
			message: this.uiTexts.PROCESSING
		});
	}
	delSysMsg(id: string) {
		this.systemMessage = this.systemMessage.filter((msg) => msg.id !== id);
	}
	async process(method: Function) {
		this.processing = true;
		const msg = sysState.defaultProcessing('PROCESSING');
		await method();
		sysState.delSysMsg(msg.id);
		this.processing = false;
	}
}

const sysState = new SystemState();
setInterval(() => {
	sysState.now = new Date();
}, 1000);

export { sysState };
