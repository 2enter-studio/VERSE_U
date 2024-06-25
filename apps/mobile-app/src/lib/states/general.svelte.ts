import { type Prettify } from '@repo/shared/utils';
import { Capacitor } from '@capacitor/core';
import { DEFAULT_LOCALE, UI_TEXTS, type Locale } from '@/config';
import { v4 as uuid } from 'uuid';

type SystemMessage = {
	id: string;
	created_at: Date;
	display?: 'popout' | 'side';
	type: 'SUCCESS' | 'WARNING' | 'ERROR';
	message: string;
	callback?: Function;
};

class GeneralState {
	processing = $state(false);
	showMenu = $state(true);
	selfieUpdated = $state(false);
	locale = $state<Locale>(DEFAULT_LOCALE);

	systemMessage = $state<SystemMessage[]>([
		{
			id: uuid(),
			created_at: new Date(),
			display: 'popout',
			type: 'WARNING',
			message: 'Fuck you',
			callback: () => {
				console.log('fuck you ');
			}
		}
	]);
	readonly uiTexts = $state.frozen(UI_TEXTS[this.locale]);
	readonly platform = $state.frozen(Capacitor.getPlatform());

	addSysMsg(input: Prettify<Omit<SystemMessage, 'created_at' | 'id'>>) {
		const now = new Date();
		const id = uuid();
		this.systemMessage.push({ ...input, created_at: now, id });
	}
	defaultError(message: string) {
		this.addSysMsg({
			type: 'ERROR',
			display: 'side',
			message
		});
	}
	defaultSuccess(message: string) {
		this.addSysMsg({
			type: 'SUCCESS',
			display: 'side',
			message
		});
	}
	delSysMsg(id: string) {
		this.systemMessage = this.systemMessage.filter((msg) => msg.id !== id);
	}
	async process(method: Function) {
		this.processing = true;
		await method();
		this.processing = false;
	}
}

const generalState = new GeneralState();

export { generalState };
