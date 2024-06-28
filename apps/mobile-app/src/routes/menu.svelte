<script lang="ts">
	// import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { TripStatus } from '$routes/index';

	const routes = [
		{ path: '/social', icon: 'iconoir:chat-bubble' },
		{ path: '/map', icon: 'gis:map-poi' },
		{ path: '/me', icon: 'fa6-solid:face-laugh' }
	] as const;
</script>

<div class="fixed bottom-0 flex flex-col">
	<TripStatus />
	<div
		id="menu"
		class="flex h-[7.6vh] w-screen flex-row items-center justify-evenly border-y-2 border-solid border-black bg-center pb-1"
		style="

			background-image: url('https://as1.ftcdn.net/v2/jpg/05/17/71/20/1000_F_517712047_eiriSlj4upbq2O97gXIXaIDuiZAfufRJ.jpg');
			background-size: 80%;
		"
	>
		{#each routes as { path, icon }}
			{@const active = $page.url.pathname === path}
			<a
				class="{active
					? 'size-[6.5vh] border-8 border-dashed border-cyan-700 bg-yellow-300 text-black'
					: 'size-[6vh] border-2 border-white bg-black/90'}
				center-content rounded-full text-[2.9vh] shadow-lg shadow-black/70"
				href={path}
			>
				<Icon {icon} />
			</a>
		{/each}
	</div>
</div>
