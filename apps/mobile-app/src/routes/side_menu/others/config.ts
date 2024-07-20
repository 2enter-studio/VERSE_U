import BLOCKS from './blocks.svelte';
import COUPONS from './coupons.svelte';

const elements = { BLOCKS, COUPONS };

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
	}
] as const;

export { items, elements };
