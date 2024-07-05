import { db } from '@/server/db';
import type { Player, UEPlayer } from '@/config';

async function getLeaderBoard() {
	const { data, error } = await db
		.from('profiles')
		.select('user, owned_wearings(wearing(id,mesh),equipped)')
		.eq('owned_wearings.equipped', true)
		.order('last_active')
		.limit(10)
		.returns<(Player & { owned_wearings: { wearing: any }[] })[]>();

	if (!data) return [];
	data.forEach((player) => {
		player.wearings = player.owned_wearings.map((w) => w.wearing);
	});

	// console.log(error);
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
		skinCol: { X: 253, Y: 198, Z: 162 }
	};
}

export { getLeaderBoard, genUEPlayer, getPlayerInfo };
