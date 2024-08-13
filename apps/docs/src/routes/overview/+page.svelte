<script lang="ts">
	import { Code, Heading } from '@/components';
	import { APPS } from '@/config';
	import { Subheading } from '@/components/index.js';
</script>

<section id="apps">
	<Heading><a href="/apps/overview" class="link link-hover">Apps</a></Heading>
	<div class="content">
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
	</div>
</section>

<section id="packages">
	<Heading>Packages</Heading>
	<div class="content">
		📦 <a href="/packages/shared" class="link link-hover link-primary">shared</a>
	</div>
</section>

<section id="dot-env">
	<Heading>.env</Heading>
	<div class="content">
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
	</div>
</section>
