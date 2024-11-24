import HAI_AN from './hai_an.svelte';
import ONE_O_ONE from './one_o_one.svelte';

const elements = { HAI_AN, ONE_O_ONE };

type Item = {
	name: keyof typeof elements;
	icon: string;
	class: string;
};

const items: Item[] = [
	{
		name: 'HAI_AN',
		icon: 'game-icons:teleport',
		class: 'bg-cyan-300'
	},
	{
		name: 'ONE_O_ONE',
		icon: 'game-icons:teleport',
		class: 'bg-magenta-300'
	}
] as const;

export { items, elements };
