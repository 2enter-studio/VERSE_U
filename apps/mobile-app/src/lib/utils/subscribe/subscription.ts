import type { AllSupaTableName } from '@repo/shared/utils';
import type { RealtimePostgresUpdatePayload as Payload } from '@supabase/realtime-js/dist/module/RealtimeChannel';
import type { Tables } from '@repo/shared/supatypes';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { db } from '@/db';

type InitArgs<T extends AllSupaTableName> = {
	tableName: T;
	callback: (payload: Payload<Tables<T>>) => void;
	channelName?: string;
	filter?: string;
	event?: string;
};

class Subscription<T extends AllSupaTableName> {
	tableName: T;
	callback: (payload: Payload<Tables<T>>) => void;

	channelName: string;
	filter: string | null = null;
	event = 'UPDATE';

	channel: RealtimeChannel;

	constructor(args: InitArgs<T>) {
		this.tableName = args.tableName;
		this.callback = args.callback;
		if (args.filter) this.filter = args.filter;
		if (args.event) this.event = args.event;

		if (args.channelName) {
			this.channelName = args.channelName;
			this.channel = db.channel(args.channelName);
		} else {
			this.channelName = this.tableName;
			this.channel = db.channel(this.tableName);
		}
	}

	subscribe() {
		const options: any & { filter?: string } = {
			schema: 'public',
			event: this.event,
			table: this.tableName
		};
		if (this.filter) options.filter = this.filter;

		this.channel.on('postgres_changes', options, this.callback).subscribe();
		console.log(`start listening on ${this.channelName}`);
		// console.log(`channel info`, this.channel);
	}

	async unsubscribe() {
		await db.removeChannel(this.channel);
	}
}

export { Subscription };
