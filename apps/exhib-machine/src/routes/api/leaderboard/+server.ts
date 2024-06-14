import { json } from '@sveltejs/kit';
import { getLeaderBoard } from '@/server/players';
import type { UEPlayer, UEPlayerBundle } from '@/config';

export const GET = async () => {
	const players = await getLeaderBoard();
	if ('error' in players) return json({ error: players.error }, { status: 500 });

	const uePlayers: UEPlayer[] = players.map((player) => {
		return {
			id: player.user,
			wearings: player.wearings,
			skinCol: { X: 0, Y: 0, Z: 0 }
		};
	});
	const result: UEPlayerBundle = { avatars: uePlayers };

	return json(result);
};
