import { v4 as uuid } from 'uuid';
import { Capacitor } from '@capacitor/core';

import type { Tables } from '@repo/shared/supatypes';
import { inPeriod, type Prettify } from '@repo/shared/utils';
import type { Locale } from '@repo/shared/config';

import type { TextCode } from '@/config/ui_texts/types';
import { DEFAULT_LOCALE, DEFAULT_ROUTE, type Route, UI_TEXTS } from '@/config';
import { needUpdate } from '@/utils';

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
	route = $state<Route>(DEFAULT_ROUTE);

	remoteAppVersion = $state<Tables<'app_versions'> | null>(null);
	maintenance = $state<Tables<'maintenance'> | null>(null);
	downloadProgress = $state(0);

	systemMessage = $state<SystemMessage[]>([]);
	readonly uiTexts = $derived(UI_TEXTS[this.locale]);
	readonly platform = $state.frozen(Capacitor.getPlatform());
	readonly maintaining = $derived(
		inPeriod(this.maintenance?.start ?? 0, this.maintenance?.end ?? 0, this.now)
	);
	readonly appLocked = $derived(this.maintaining || needUpdate());

	routeTo(route: Route) {
		this.route = route;
	}
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
	defaultSuccess(message?: TextCode) {
		return this.addSysMsg({
			type: 'SUCCESS',
			display: 'side',
			message: this.uiTexts[message ?? 'SUCCESS']
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
		const msg = sysState.defaultProcessing();
		const result = await method();
		if (result?.error) {
			sysState.defaultError('OPERATION_FAILED');
		}
		// await method();
		sysState.delSysMsg(msg.id);
		this.processing = false;
	}
}

const sysState = new SystemState();
setInterval(() => {
	sysState.now = new Date();
}, 1000);

export { sysState };
