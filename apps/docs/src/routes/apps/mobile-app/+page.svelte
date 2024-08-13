<script lang="ts">
	const FILES = [
		{ name: 'android/', description: '' },
		{ name: 'ios/', description: '' },
		{ name: 'assets/', description: '' },
		{
			name: 'src/',
			content: [
				{ name: 'assets/', description: '' },
				{
					name: 'lib/',
					description: '',
					content: [
						{ name: 'components/', description: '' },
						{ name: 'config/', description: '' },
						{ name: 'shadcn-components', description: '' },
						{ name: 'states', description: '' },
						{ name: 'utils', description: '' },
						{ name: 'db.ts', description: '' }
					]
				},
				{ name: 'routes/', description: '' }
			]
		},
		{ name: 'static/', content: [] },
		{ name: 'capacitor.config.ts' },
		{ name: 'components.json' },
		{ name: 'ecosystem.config.cjs' },
		{ name: 'package.json' }
	] as const;

	const FLATTEN_FILES = FILES.forEach((file) => {});
</script>

<div class="flex flex-col">
	{#each FILES as file}
		<span>{file.name}</span>
		{#if file.content}
			{#each file.content as subFile}
				<span class="pl-4">{subFile.name}</span>
			{/each}
		{/if}
	{/each}
</div>
