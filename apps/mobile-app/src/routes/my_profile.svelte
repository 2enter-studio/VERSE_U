<script lang="ts">
	import { fly } from 'svelte/transition';

	import { authState, unergyState } from '@/states';
	import { Avatar } from '@/components';
	import { Coin } from '$routes';

	let openSetting = $state(false);
</script>

{#if authState.profile}
	<div>
	<button
		onclick={() => (openSetting = !openSetting)}
		transition:fly={{ x: -100 }}
		class="center-content pointer-events-auto my-3 h-8 w-fit flex-row gap-1 rounded-xl bg-orange-500 pr-3 text-sm shadow-inner shadow-orange-200/50"
	>
		<Avatar
			profile={authState.profile}
			readonly={false}
			class="size-12 shadow-md shadow-orange-900/30"
		/>
			{authState.profile.name}
		</button>
		<Coin unergy={unergyState.unergy} />
	</div>
{/if}
