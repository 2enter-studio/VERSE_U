import { v4 as uuid } from 'uuid';
import { Capacitor } from '@capacitor/core';

import type { Tables } from '@repo/shared/supatypes';
import { inPeriod, type Prettify } from '@repo/shared/utils';

import type { TextCode, UITextTable } from '@/config/ui_texts/types';
import { DEFAULT_LOCALE, DEFAULT_ROUTE, type Route, UI_TEXTS } from '@/config';
import { needUpdate } from '@/utils';
import { type MyPref } from '@/utils/preferences';

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
	now = $state<Date>(new Date());
	route = $state<Route>(DEFAULT_ROUTE);

	pref = $state<MyPref>({
		locale: DEFAULT_LOCALE,
		music_volume: 50,
		sound_volume: 50
	});

	remoteAppVersion = $state<Tables<'app_versions'> | null>(null);
	maintenance = $state<Tables<'maintenance'> | null>(null);
	downloadProgress = $state(0);

	systemMessage = $state<SystemMessage[]>([]);
	uiTexts: UITextTable = $derived(UI_TEXTS[this.pref.locale]);
	readonly platform = $state.raw<'web' | 'ios' | 'android'>(
		Capacitor.getPlatform() as 'web' | 'ios' | 'android'
	);
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
	defaultError(message?: TextCode) {
		return this.addSysMsg({
			type: 'ERROR',
			display: 'side',
			message: this.uiTexts[message ?? 'OPERATION_FAILED']
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
	async process(method: Function, successCode?: TextCode, errorCode?: TextCode, after?: Function) {
		this.processing = true;
		const msg = sysState.defaultProcessing();
		await method();
		sysState.delSysMsg(msg.id);
		this.processing = false;
		await after?.();
	}
}

const sysState = new SystemState();

setInterval(() => {
	sysState.now = new Date();
}, 1000);

export { sysState };
