<script lang="ts">
	import { FileStructSection, Section } from '@/components/index.js';
	import { FILES } from './files';
</script>

<Section name="DB client">
	This code-base will eventually compiled into a native mobile app. Which means there's no back-end.
	The database client is declared in /src/lib/db.ts using SUPABASE_ANON_KEY.
</Section>
<Section name="Data loading">
	There are lots of data need to be loaded before user can actually use the app. All load functions
	are declared in /src/lib/utils/load.ts. Which is well-integrated with the states declared in
	/src/lib/states. Depending on the auth state, we'll call the corresponding load when initializing
	the page.
</Section>
<Section name="Local storage">
	By using the capacitor.js built-in FileSystem. We can download large files into device's local
	storage and reuse them locally. The core functions are declared in /src/lib/storage.ts
</Section>
<Section name="Constant values">dkdk</Section>
<Section name="Multilingual UI texts and database texts">dkdk</Section>
<Section name="State management">dkdk</Section>
<Section name="Routes">dkdk</Section>
<Section name="Subscribe">dkdk</Section>
<Section name="Components">dkdk</Section>
<Section name="Custom form">dkdk</Section>
<Section name="Audio loader">dkdk</Section>
<Section name="System messages">dkdk</Section>

<Section name="(Almost) every files explained" useToggle>
	{#each FILES as file}
		<FileStructSection {...file} />
	{/each}
</Section>
