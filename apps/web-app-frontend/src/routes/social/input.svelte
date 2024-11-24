<script lang="ts">
	import Icon from '@iconify/svelte';

	// import { sendMessage } from './utils';
	import { authState, gameState, sysState, unergyState } from '@/states';

	let { onsend }: { onsend: Function } = $props();

	let content = $state('');
	let textAreaDom: HTMLTextAreaElement;

	const submittable = $derived(!sysState.processing && content.trim() !== '');

	async function send() {
		sysState.processing = true;
		// const result = await sendMessage(content);
		// if ('error' in result) {
		// 	console.error(result.error);
		// } else {
		// 	content = '';
		// }
		sysState.processing = false;
		setHeight(true);
		onsend();
		// if the person is your friend, you will get 1 unergy
		const currentChat = gameState.friendChats.find(chat => chat.id === gameState.chat_id)
		if (currentChat) {
			unergyState.addUnergy(1)

			const person = currentChat?.chat_members.find(member => member.user.id !== authState.user?.id)
			const isFriendNearBy = gameState.peopleNearBy.find(p => p.id === person?.user.id)
			// if the friend is near by, you will get 1 more unergy
			if (isFriendNearBy) {
				unergyState.addUnergy(1)
			}
		}
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

<div class="flex h-fit w-screen flex-row items-end bg-black pb-3 px-1">
	<textarea
		class="spacing-1 my-1 w-[90%] resize-y rounded-xl bg-white/20 p-2 text-white"
		rows="1"
		bind:value={content}
		bind:this={textAreaDom}
		{oninput}
	></textarea>
	<div class="mb-2 flex w-[10%] justify-center">
		<button
			onclick={send}
			class={submittable ? 'text-amber-300' : 'pointer-events-none text-white/30'}
		>
			<Icon icon="fluent:send-28-filled" class="text-2xl text-inherit" />
		</button>
	</div>
</div>
