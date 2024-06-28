<script lang="ts">
	import { triggerHaiAn } from '@/utils/hai_an';
	import { Dialog } from '@/components';

	let open = $state(false);
	let data = $state({ passcode: '' });

	// async function onsubmit(data: { passcode: string }) {
	// 	await triggerHaiAn(data.passcode);
	// }
</script>

<!--<div class="fixed right-0 flex flex-col">-->
<!--	<input type="checkbox" bind:checked={open} />-->
<!--	<Dialog title="Hi" {open} class="center-content flex-col text-black">-->
<!--&lt;!&ndash;		<Form data={{ passcode: '' }} icon="game-icons:teleport" {onsubmit} class="center-content" />&ndash;&gt;-->
<!--		<input type="text" name="passcode" bind:value={data.passcode} />-->
<!--		<button onclick={() => triggerHaiAn(data.passcode)} class="bg-white p-3 text-black">GO</button>-->
<!--	</Dialog>-->
<!--</div>-->
