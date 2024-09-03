<script lang="ts">
	import { Code, Subheading, Section } from '@/components';
	import { APPS } from '@/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Section name="<a href='/apps/overview' class='link link-hover'>Apps</a>">
	<Subheading>Brief description</Subheading>
	<ul>
		{#each APPS as app}
			<li class="mt-1">
				🍎 <a href="/apps/{app.name}" class="link link-hover link-primary">
					{app.name}
				</a>
				<br />
				&nbsp&nbsp-> {app.description}
			</li>
		{/each}
	</ul>
</Section>

<Section name="Packages">
	📦 <a href="/packages/shared" class="link link-hover link-primary">shared</a>
</Section>

<Section name=".env">
	<Code
		lines={[
			'# .env.example',
			'SUPABASE_URL=https://<project_id>.supabase.co',
			'SUPABASE_SERVICE_ROLE_KEY=<remote_service_role_key>',
			'SUPABASE_ANON_KEY=<remote_anon_key>',
			'',
			'LOCAL_SUPABASE_URL=http://127.0.0.1:54321',
			'LOCAL_SUPABASE_SERVICE_ROLE_KEY=<local_service_role_key>',
			'LOCAL_SUPABASE_ANON_KEY=<local_anon_key>',
			'',
			'DEVELOPING=1'
		]}
	></Code>
</Section>

<Section name="package.json">
	<Code language="json" lines={JSON.stringify(data.packageJson, null, 2).split('\n')}></Code>
</Section>
