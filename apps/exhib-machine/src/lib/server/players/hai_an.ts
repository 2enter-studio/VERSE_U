import { db } from '@/server/db';
import type { UEPlayerBundle } from '@/config';
import { broadcastMessage } from '@/server/ws';
import { genUEPlayer, getPlayerByIds } from './player';

async function getLeaderBoard() {
	const { data, error } = await db
		.from('profiles')
		.select('user')
		.order('last_active')
		.limit(10)
		.returns<{ user: string }[]>();

	if (!data) return [];
	const ids = data.map((d) => d.user);
	return await getPlayerByIds(ids);
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

	{
		const { error } = await db.from('hai_an_players').delete().eq('player', target_id);
		if (error) {
			console.error(error);
			return;
		}
	}

	const player = await getPlayerByIds([target_id]);
	const uePlayer = genUEPlayer(player[0]);
	const message: UEPlayerBundle = { avatars: [uePlayer] };
	broadcastMessage(message);
}

export { callHaiAnPlayer, getLeaderBoard };
