<script lang="ts">
	import { fly } from 'svelte/transition';

	import { authState } from '@/states';
	import { Avatar } from '@/components';

	let openSetting = $state(false);
</script>

{#if authState.profile}
	<button
		onclick={() => (openSetting = !openSetting)}
		transition:fly={{ x: -100 }}
		class="center-content pointer-events-auto mt-3 h-7 w-fit flex-row gap-1 rounded-xl bg-orange-500 pr-3 text-sm shadow-inner shadow-orange-200/50 "
	>
		<Avatar
			profile={authState.profile}
			readonly={false}
			class="size-12 shadow-md shadow-orange-900/30 relative"
		/>
		{authState.profile.name}
	</button>
{/if}
