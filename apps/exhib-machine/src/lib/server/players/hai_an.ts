import { db } from '@/server/db';
import type { Player, UEPlayerBundle } from '@/config';
import { genUEPlayer } from '@/server/players';
import { broadcastMessage } from '@/server/ws';

async function callHaiAnPlayer() {
	const { data, error } = await db
		.from('hai_an_players')
		.select('id')
		.order('created_at', { ascending: true })
		.limit(1)
		.single();

	if (error || !data) return;
	const target_id = data.id;
	{
		const { data, error } = await db
			.from('hai_an_players')
			.delete()
			.eq('id', target_id)
			.select('player(user, wearings(id,mesh))')
			.returns<{ player: Player }[]>()
			.single();

		if (error || !data) return;
		const uePlayer = genUEPlayer(data.player);
		const message: UEPlayerBundle = { avatars: [uePlayer] };

		broadcastMessage(JSON.stringify(message));
	}
}

export { callHaiAnPlayer };
