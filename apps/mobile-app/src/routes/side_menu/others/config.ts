import BLOCKS from './blocks.svelte';
import COUPONS from './coupons.svelte';
import TUTORIAL from './tutorial.svelte';

const elements = { BLOCKS, COUPONS, TUTORIAL };

type Item = {
	name: keyof typeof elements;
	icon: string;
	class: string;
};

const items: Item[] = [
	{
		name: 'BLOCKS',
		icon: 'fluent:people-48-filled',
		class: 'bg-cyan-700 text-white'
	},
	{
		name: 'COUPONS',
		icon: 'mdi:coupon',
		class: 'bg-purple-700 text-white'
	},
	{
		name: 'TUTORIAL',
		icon: 'fluent:people-48-filled',
		class: 'bg-gray-700 text-white'
	}
] as const;

export { items, elements };
