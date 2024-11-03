<script lang="ts">
	// import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { TripStatus } from './';
	import { sysState } from '@/states';

	const routes = [
		{ route: 'social', icon: 'iconoir:chat-bubble' },
		{ route: 'map', icon: 'gis:map-poi' },
		{ route: 'me', icon: 'fa6-solid:face-laugh' }
	] as const;
</script>

<div class="pointer-events-auto flex flex-col">
	<TripStatus />
	<div
		id="menu"
		class="flex w-screen flex-row items-center justify-evenly border-y-2 border-solid border-black bg-center pb-1"
		style="

			background-image: url('https://as1.ftcdn.net/v2/jpg/05/17/71/20/1000_F_517712047_eiriSlj4upbq2O97gXIXaIDuiZAfufRJ.jpg');
			background-size: 80%;
		"
	>
		{#each routes as { route, icon }}
			{@const active = sysState.route === route}
			
			<button
				onclick={() => sysState.routeTo(route)}
				class="{active
					? 'size-[6.5vh] border-8 border-dashed border-cyan-700 bg-yellow-300 text-black'
					: 'size-[6vh] border-2 border-white bg-black/90'}
					center-content my-0.5 rounded-full text-[2.9vh] shadow-lg shadow-black/70 shepherd-{route} relative"
				>
					<div class="pulsing"></div>
					<Icon {icon} />
				</button>
		{/each}
	</div>
</div>
