<script lang="ts">
	import { localStorageState } from '@/states';

	type Props = { open: boolean };
	let { open = $bindable(false) }: Props = $props();

	function setCompletedTutorial(value: boolean) {
		localStorageState.setCompletedTutorial(value);
		open = false;
	}
</script>

<div class="center-content flex-col gap-4">
	<span>你確定要開始教學嗎？</span>
	<div class="flex-row gap-2">
		<button
			onclick={() => setCompletedTutorial(true)}
			class="bg-red-500 text-white px-4 py-2 rounded-md"
		>
			跳過教學
		</button>
		<button
			onclick={() => setCompletedTutorial(false)}
			class="bg-green-500 text-white px-4 py-2 rounded-md"
		>
			開始教學
		</button>
	</div>
</div>
