import HAI_AN from './hai_an.svelte';

const elements = { HAI_AN };

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
	}
] as const;

export { items, elements };
