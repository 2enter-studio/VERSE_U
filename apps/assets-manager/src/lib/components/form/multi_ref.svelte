<script lang="ts">
	import type { RefProps } from '@/components/form/types';
	import { getRowName } from '@/index';
	import pluralize from 'pluralize';
	let { base, target, class: className, base_id }: RefProps = $props();

	let selected = $state<string[]>([]);

	async function fetchOptions() {
		const res = await fetch(`/api/j/${base}-${target}/${base_id}`);
		return res.json();
	}
</script>

{#await fetchOptions() then data}
	{@const options = data.map((d) => d[pluralize.singular(target)])}
	<div class="flex flex-col">
		{#each options as option}
			{@const isSelected = selected.includes(option.id)}
			<input
				id="option-{option.id}"
				type="checkbox"
				bind:group={selected}
				value={option.id}
				hidden
			/>
			<label for="option-{option.id}" class={isSelected ? 'bg-white text-black' : ''}>{getRowName(option)}</label>
		{/each}
	</div>
{/await}
