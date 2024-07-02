<script lang="ts">
	import { triggerHaiAn } from '@/utils/hai_an';
	import { Dialog } from '@/components';

	let open = $state(false);
	let data = $state({ passcode: '' });
</script>

<div class="flex h-[30vh] flex-col bg-white">
	<input type="checkbox" bind:checked={open} />
	<Dialog title="Hi" {open} class="center-content flex-col text-black">
		<!--		<Form data={{ passcode: '' }} icon="game-icons:teleport" {onsubmit} class="center-content" />-->
		<input type="text" name="passcode" bind:value={data.passcode} />
		<button onclick={() => triggerHaiAn(data.passcode)} class="bg-white p-3 text-black">GO</button>
	</Dialog>
</div>
