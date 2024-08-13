<script lang="ts">
	import { Code, Heading } from '@/components';
	import { APPS } from '@/config';

	let selectedPortNum = $state<number | null>(null);
</script>

<section>
	<Heading>0. Ensure prerequisites</Heading>
	<div class="content">
		<ul class="*:before:content-['🍕']">
			<li>
				<a href="https://bun.sh" class="link link-hover w-fit link-primary" target="_blank">Bun</a>
				is used as the default package & monorepo manager
			</li>
			<li>
				Use
				<a
					href="https://supabase.com/docs/guides/cli/getting-started"
					target="_blank"
					class="link link-hover w-fit link-primary"
				>
					Supabase CLI
				</a>
				to develop supabase, which requires
				<a href="https://docker.com" class="link link-hover w-fit link-primary" target="_blank">
					Docker
				</a>
				to host the database locally.
			</li>
		</ul>
	</div>
</section>

<section>
	<Heading>1. (Optional) start supabase local instance</Heading>
	<div class="content">
		(Skip this if you only work with the remote database, or developing apps that don't require db
		connection)
		<Code
			lines={[
				'cd ./packages/shared/supabase',
				'supabase start',
				'# now, use this command to display DB infos',
				'supabase status'
			]}
			prefix="$"
		></Code>
		Your output should look similar to this. Please pay attention to the *5th & 6th* lines, those are
		essential for the next step:
		<Code
			language="html"
			lines={[
				'S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3',
				'DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres',
				'Studio URL: http://127.0.0.1:54323',
				'Inbucket URL: http://127.0.0.1:54324',
				'JWT secret: super-secret-jwt-token-with-at-least-32-characters-long',
				'anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
				'service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
				'S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c',
				'S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907',
				'S3 Region: local'
			]}
		></Code>
	</div>
</section>

<section>
	<Heading>2. (Optional) set environment variables</Heading>
	<div class="content">
		<article>
			If you're developing one of these apps:
			{@html APPS.filter(({ dbRelated }) => dbRelated)
				.map(
					({ name }) => `<a href="/apps/${name}" class="link link-hover link-primary">${name}</a>`
				)
				.join(', ')}. Create .env in each one and put these contents.
		</article>
		<Code
			lines={[
				'# for remote db development',
				'SUPABASE_URL=https://<project_id>.supabase.co',
				'SUPABASE_SERVICE_ROLE_KEY=<remote_service_role_key>',
				'SUPABASE_ANON_KEY=<remote_anon_key>',
				'',
				'# for local db development',
				'LOCAL_SUPABASE_URL=http://127.0.0.1:54321',
				'LOCAL_SUPABASE_SERVICE_ROLE_KEY=<local_service_role_key>',
				'LOCAL_SUPABASE_ANON_KEY=<local_anon_key>',
				'',
				'# set to 1 if developing with local db',
				'DEVELOPING=1'
			]}
		></Code>
	</div>
</section>

<section>
	<Heading>3. Start the dev server</Heading>
	<div class="content">
		<Code
			lines={[
				'# at project root',
				'bun install # install packages',
				'bun dev # starting the dev server'
			]}
			prefix="$"
		></Code>
	</div>
</section>

<section>
	<Heading>4. Accessing svelte apps through browser</Heading>
	<div class="content">
		<div class="mockup-browser border w-5/6">
			<div class="mockup-browser-toolbar">
				<div class="input bg-base-300">
					http://localhost:{selectedPortNum ?? '<port_number>'}
					{#if selectedPortNum}
						<span class="bg-white/10 rounded-lg p-0.5"> Copied! </span>
					{/if}
				</div>
			</div>
		</div>
		<table class="table">
			<thead>
				<tr>
					<th>app name</th>
					<th>dev server port_number</th>
				</tr>
			</thead>
			<tbody>
				{#each APPS.filter(({ framework }) => framework === 'SvelteKit') as { name, port }}
					<tr>
						<td><a href="/apps/{name}" class="link link-secondary link-hover">{name}</a></td>
						<td>
							<button
								class="btn btn-sm"
								onclick={() => {
									selectedPortNum = port;
									navigator.clipboard.writeText(`http://localhost:${port}`);
								}}
							>
								{port}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
