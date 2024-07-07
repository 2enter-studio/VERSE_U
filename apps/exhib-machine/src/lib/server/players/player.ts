import { db } from '@/server/db';
import { type Player, type UEPlayer } from '@/config';
import { DEFAULT_SKIN_COLOR } from '@repo/shared/config';

async function getPlayerByIds(ids: string[]): Promise<Player[]> {
	const { data, error } = await db
		.from('profiles')
		.select('user, owned_wearings(wearing(id,mesh,category(is_expression)),equipped)')
		.eq('owned_wearings.equipped', true)
		.in('user', ids)
		.order('last_active')
		.returns<
			(Player & {
				owned_wearings: {
					wearing: { id: string; mesh: string; category: { is_expression: boolean } };
				}[];
			})[]
		>();

	if (error) return [];

	data.forEach((player) => {
		player.wearings = player.owned_wearings.map(({ wearing }) => {
			return {
				id: wearing.id,
				mesh: wearing.id,
				is_expression: wearing.category.is_expression
			};
		});
	});

	return data;
}

function genUEPlayer(player: Player): UEPlayer {
	return {
		id: player.user,
		wearings: player.wearings,
		skinCol: DEFAULT_SKIN_COLOR
	};
}

export { getPlayerByIds, genUEPlayer };
