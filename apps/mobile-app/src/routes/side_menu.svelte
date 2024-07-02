<script lang="ts">
	import { triggerHaiAn } from '@/utils/hai_an';
	import { Dialog, Form, SubmitBtn } from '@/components';

	let open = $state(false);
	let data = $state({ passcode: '' });
</script>

<div class="pointer-events-auto flex h-[30vh] flex-col bg-white">
	<input type="checkbox" bind:checked={open} />
	<Dialog title="Hi" bind:open class="center-content flex-col text-black">
		<Form submitFunction={triggerHaiAn}>
			<input type="text" name="passcode" />
			<SubmitBtn>Go</SubmitBtn>
		</Form>
	</Dialog>
</div>
