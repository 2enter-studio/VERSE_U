import { db } from '@/server/db';
import type { Player, UEPlayer } from '@/config';

async function getLeaderBoard() {
	const { data, error } = await db
		.from('profiles')
		.select('user, wearings(id,mesh)')
		.order('last_active')
		.limit(10)
		.returns<Player[]>();

	if (error) return { error };
	return data;
}

async function getPlayerInfo(player_id: string) {
	const { data, error } = await db
		.from('profiles')
		.select('wearings(id, mesh)')
		.eq('user', player_id)
		.returns<Player[]>()
		.single();
	if (error) return { error };
	return data;
}

function genUEPlayer(player: Player): UEPlayer {
	return {
		id: player.user,
		wearings: player.wearings,
		skinCol: { X: 0, Y: 0, Z: 0 }
	};
}

export { getLeaderBoard, genUEPlayer, getPlayerInfo };
