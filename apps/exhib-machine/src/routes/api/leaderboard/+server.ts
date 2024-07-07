import type { UEPlayer, UEPlayerBundle } from '@/config';

import { json } from '@sveltejs/kit';
import { getLeaderBoard, genUEPlayer } from '@/server/players';

export const GET = async () => {
	const players = await getLeaderBoard();
	if ('error' in players) return json({ error: players.error }, { status: 500 });

	const uePlayers: UEPlayer[] = players.map(genUEPlayer);
	const result: UEPlayerBundle = { avatars: uePlayers };

	return json(result);
};
