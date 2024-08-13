<script lang="ts">
	import { APPS } from '@/config.js';
</script>

<table class="table">
	<thead>
		<tr>
			<th>app name</th>
			<th>description</th>
			<th>framework</th>
			<th>adapter</th>
			<th>dev server port</th>
			<th>db connection</th>
		</tr>
	</thead>
	<tbody>
		{#each APPS as { name, description, framework, port, svelteAdaptor, dbRelated }}
			{@const items = [description, framework, svelteAdaptor, port, dbRelated]}
			<tr>
				<td>
					<a href="/apps/{name}" class="link link-hover link-accent">{name}</a>
				</td>
				{#each items as item}
					<td> {item ?? 'X'} </td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
