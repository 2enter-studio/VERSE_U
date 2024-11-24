<script lang="ts">
	import { Shepherd } from '@/components';
	import '../app.css';
	import { type Snippet } from 'svelte';
	import { localStorageState, authState } from '@/states';

	let { children }: { children: Snippet } = $props();
	let hasCompletedTutorial = $state(true);

	$effect(() => {
		localStorageState.setCompletedTutorial(localStorage.getItem('hasCompletedTutorial') === 'true');
		hasCompletedTutorial = localStorageState.hasCompletedTutorial;
	});
</script>

<div class="h-screen w-screen">
	{#if !hasCompletedTutorial && authState.profile}
		<Shepherd />
	{/if}
	{@render children()}
</div>
