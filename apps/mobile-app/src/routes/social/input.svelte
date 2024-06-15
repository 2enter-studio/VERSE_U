<script lang="ts">
	import Icon from '@iconify/svelte';

	import { sendMessage } from '@/utils/chat';
	import { processing } from '@/stores';

	let { dom = $bindable<HTMLElement>(), onsend }: { dom?: HTMLElement; onsend: () => void } = $props();

	let content = $state('');
	let textAreaDom: HTMLTextAreaElement;

	const submittable = $derived(!$processing && content.trim() !== '');

	async function send() {
		$processing = true;
		const result = await sendMessage(content);
		if ('error' in result) {
			console.error(result.error);
		} else {
			content = '';
		}
		$processing = false;
		setHeight(true);
		onsend();
	}

	// Auto adjust text area's height
	function setHeight(withDelay = false) {
		textAreaDom.style.height = '2px';
		if (withDelay)
			setTimeout(() => {
				textAreaDom.style.height = textAreaDom.scrollHeight + 'px';
			});
		else textAreaDom.style.height = textAreaDom.scrollHeight + 'px';
	}

	function oninput() {
		setHeight();
	}
</script>

<div bind:this={dom} class="fixed bottom-0 left-0 flex h-fit w-screen flex-row items-end bg-black px-1 pb-3">
	<textarea
		class="spacing-1 my-1 w-[90%] resize-y rounded-xl bg-white/20 p-2 text-white"
		rows="1"
		bind:value={content}
		bind:this={textAreaDom}
		{oninput}
	></textarea>
	<div class="mb-2 flex w-[10%] justify-center">
		<button onclick={send} class={submittable ? 'text-amber-300' : 'pointer-events-none text-white/30'}>
			<Icon icon="fluent:send-28-filled" class="text-2xl text-inherit" />
		</button>
	</div>
</div>
