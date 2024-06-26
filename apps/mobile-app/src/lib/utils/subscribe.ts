import type { RealtimeChannel } from '@supabase/supabase-js';
import type { RealtimePostgresUpdatePayload as Payload } from '@supabase/realtime-js/dist/module/RealtimeChannel';
import type { Tables } from '@repo/shared/supatypes';
import { gameState } from '@/states';
import { createError } from '@/utils/error';
import { db } from '@/db';
import type { AllTableName } from '@repo/shared/utils';

type InitArgs<T extends AllTableName> = {
	channelName: string;
	tableName: T;
	callback: (payload: Payload<Tables<T>>) => void;
	filter?: string;
};

class Subscription<T extends AllTableName> {
	readonly channelName: string;
	readonly tableName: T;
	readonly filter: string | null = null;
	readonly callback: (payload: Payload<Tables<T>>) => void;
	readonly channel: RealtimeChannel;

	constructor(args: InitArgs<T>) {
		this.channelName = args.channelName;
		this.channel = db.channel(args.channelName);
		this.tableName = args.tableName;
		this.callback = args.callback;
		if (args.filter) this.filter = args.filter;
		this.subscribe();
	}

	subscribe<T extends string>() {
		const options: any & { filter?: string } = {
			schema: 'public',
			table: this.tableName,
			event: 'UPDATE'
		};
		if (this.filter) options.filter = this.filter;

		this.channel.on('postgres_changes', options, this.callback).subscribe();
	}

	async unsubscribe() {
		if (this.channel) {
			await db.removeChannel(this.channel);
		}
	}
}

export { Subscription };
