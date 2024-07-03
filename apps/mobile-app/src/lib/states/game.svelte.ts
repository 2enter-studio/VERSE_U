import type { Tables } from '@repo/shared/supatypes';
import { MIN_STAY_TIME } from '@repo/shared/config';
import { sysState } from '@/states';
import { FileDownloader, getLocalMetadata, setLocalMetadata } from '@/utils';

class GameState {
	regions = $state<Region[]>([]);
	chats = $state<ChatRoom[]>([]);
	wearings = $state<Wearing[]>([]);
	meshes = $state<Mesh[]>([]);

	trip = $state<Tables<'trips'> | null>(null);
	peopleNearBy = $state<Tables<'profiles'>[]>([]);
	chat_id = $state<string | null>(null);
	wearingTypes = $state<WearingType[]>([]);
	owned_wearings = $state<{ id: string; equipped: boolean }[]>([]);

	readonly chat = $derived(this.chats.find((chat) => chat.id === this.chat_id));
	readonly equippedWearings = $derived(this.owned_wearings.filter((wearing) => wearing.equipped));
	readonly strangerChats = $derived(this.chats.filter((c) => c.chat_members.some((m) => !m.agree)));
	readonly friendChats = $derived(this.chats.filter((c) => !this.strangerChats.includes(c)));
	readonly tripStatus = $derived.by(() => {
		const defaultResult = { progress: 0, timeRemain: 0 };
		if (!this.trip) return defaultResult;

		const now = sysState.now;
		const arriveAt = new Date(this.trip.arrive_at);
		const startAt = new Date(this.trip.start_at);
		const timeDiff = now.getTime() - arriveAt.getTime();

		let result: { progress: number; timeRemain: number };

		if (timeDiff < 0) {
			// on the way
			const progress =
				(now.getTime() - startAt.getTime()) / (arriveAt.getTime() - startAt.getTime());
			result = { timeRemain: -timeDiff, progress };
		} else if (timeDiff >= MIN_STAY_TIME) {
			// ready to go
			result = { timeRemain: 0, progress: 1 };
		} else if (timeDiff >= 0) {
			// arrived
			const timeRemain = MIN_STAY_TIME - timeDiff;
			result = { timeRemain, progress: 1 };
		} else {
			return defaultResult;
		}
		return result;
	});
	async checkAssetUpdates() {
		const fileDownloader = new FileDownloader();
		await fileDownloader.init();
		const localData: AssetMetadata = await getLocalMetadata();
		const remoteData: AssetMetadata = {
			regions: $state.snapshot(this.regions),
			wearings: $state.snapshot(this.wearings),
			owned_wearings: $state.snapshot(this.owned_wearings),
			meshes: $state.snapshot(this.meshes)
		};
		type Key = keyof AssetMetadata;
		for (const key in remoteData) {
			for (const remote of remoteData[key as Key]) {
				const local = localData[key as Key].find((d) => d.id === remote.id);
				if (!local || local.updated_at !== remote.updated_at) {
					switch (key) {
						case 'regions':
							fileDownloader.add('regions', `stickers/${remote.id}`);
							fileDownloader.add('regions', `backgrounds/${remote.id}`);
							break;
						case 'wearings':
							fileDownloader.add('wearings', `thumbnails/${remote.id}`);
							for (const { value: texture_type } of remote.texture_types) {
								fileDownloader.add('wearings', `textures/${remote.id}_${texture_type}`);
							}
							break;
						case 'meshes':
							fileDownloader.add('meshes', `glb/${remote.id}`);
							break;
						default:
							break;
					}
				}
			}
		}
		await fileDownloader.start();
		await setLocalMetadata(remoteData);
	}
}

const gameState = new GameState();

export { gameState };
