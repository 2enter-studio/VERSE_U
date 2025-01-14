import type { UEPlayer, UEPlayerBundle } from '@/config';

import { DEFAULT_SKIN_COLOR } from '@repo/shared/config';
import { db } from '@/server/db';
import { broadcastMessage } from '@/server/ws';
import { HAI_AN_CALL_TIMEOUT } from '@/config';
import { genUEPlayer, getPlayerByIds } from './player';

async function getLeaderBoard() {
	let { data, error } = await db
		.from('owned_wearings')
		.select('owner')
		.eq('equipped', true)
		.order('created_at')
		.limit(1000)
		.returns<{ owner: string }[]>();

	if (!data) return [];
	let ids: string[] = [];
	while (ids.length < 10) {
		data = data.filter(({ owner }) => !ids.includes(owner));
		const id = data[Math.floor(Math.random() * data.length)].owner;
		ids.push(id);
	}
	return await getPlayerByIds(ids);
}

async function call101Player() {
	const { data, error } = await db
		.from('one_o_one_player')
		.select('wearings,id')
		.order('created_at', { ascending: true })
		.returns<{ wearings: Record<string, string>; id: string }[]>()
		.limit(1)
		.single();

	if (error) {
		// console.error(chalk.red('no new Hai An player found'));
		// console.log(error);
		return;
	}

	const target_id = data.id;
	console.log(`get anonymous player ${target_id}`);

	const { data: wearings, error: wearingError } = await db
		.from('wearings')
		.select('category(is_expression),mesh,id')
		.in(
			'id',
			Object.values(data.wearings).filter((v) => v !== '')
		)
		.returns<{ id: string; mesh: string; category: { is_expression: boolean } }[]>();

	if (wearingError) {
		// console.error(wearingError);
		return;
	}

	{
		const { error } = await db.from('one_o_one_player').delete().eq('id', target_id);
		if (error) {
			console.error(error);
			return;
		}
	}

	const uePlayer: UEPlayer = {
		id: target_id,
		name: '',
		wearings: wearings.map(({ id, mesh, category: { is_expression } }) => {
			return { id, mesh, is_expression };
		}),
		skinCol: DEFAULT_SKIN_COLOR
	};
	const message: UEPlayerBundle = { avatars: [uePlayer] };
	broadcastMessage(message);
}

async function callHaiAnPlayer() {
	const { data, error } = await db
		.from('hai_an_players')
		.select('player')
		.order('created_at', { ascending: true })
		.returns<{ player: string }[]>()
		.limit(1)
		.single();

	if (error) {
		// console.error(chalk.red('no new Hai An player found'));
		return;
	}
	const target_id = data.player;
	console.log(`get player ${target_id}`);

	setTimeout(async () => {
		const { error } = await db.from('hai_an_players').delete().eq('player', target_id);
		if (error) {
			console.log(`cannot delete player ${target_id}`);
		}
	}, HAI_AN_CALL_TIMEOUT);

	const player = await getPlayerByIds([target_id]);
	const uePlayer = genUEPlayer(player[0]);
	const message: UEPlayerBundle = { avatars: [uePlayer] };
	broadcastMessage(message);
}

export { callHaiAnPlayer, getLeaderBoard, call101Player };
