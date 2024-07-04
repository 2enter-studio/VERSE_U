<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	import { agreeFriendShip, getMemberFromChat } from './utils';
	import { ChatMessageBubble, ChatInput } from './';
	import { authState, sysState, gameState } from '@/states';
	import { Avatar, Dialog, MenuToggler } from '@/components';

	let chatInput = $state<HTMLElement>();
	let messagePool = $state<HTMLDivElement>();
	let showInfo = $state(false);

	const inputHeight = $derived(chatInput?.clientHeight ?? 0);

	onMount(() => {
		if (!gameState.chat_id || !authState.user?.id) return;
		onsend();
	});

	$effect(() => {
		if (gameState.chat?.chat_messages) onsend();
	});

	function onsend() {
		setTimeout(() => {
			if (messagePool) messagePool.scroll({ top: messagePool.scrollHeight });
			else console.log('no message pool found');
		});
	}
</script>

<MenuToggler />

{#if gameState.chat}
	{@const person = getMemberFromChat(gameState.chat)}
	{@const me = getMemberFromChat(gameState.chat, 'me')}
	<div
		class="fixed flex h-12 w-full flex-row items-center justify-between gap-1 bg-black px-1 py-2"
	>
		<div class="flex flex-row items-center gap-1">
			<button onclick={() => (gameState.chat_id = null)}>
				<Icon icon="mdi:arrow-back" class="text-2xl" />
			</button>
			{#if person}
				<Avatar profile={person.user} class="size-9" />
				<span class="text-sm">{person?.user.name}</span>
			{/if}
			{#if gameState.chat.chat_messages.some((m) => m.sender === authState.user?.id) && gameState.chat.chat_messages.some((m) => m.sender === person?.user.user) && !me?.agree}
				<div class="center-content">
					<span class="text-xs">
						{sysState.uiTexts.MAKE_FRIEND}
					</span>
					<button
						class="bg-white px-1 text-xs text-black"
						onclick={async () => {
							const result = await agreeFriendShip();
							if (result?.error) sysState.defaultError('OPERATION_FAILED');
						}}
					>
						YES
					</button>
				</div>
			{/if}
		</div>
		<Icon icon="eva:info-outline" class="mr-1 size-5" onclick={() => (showInfo = true)} />
	</div>
	<div
		bind:this={messagePool}
		class="mt-12 w-screen overflow-x-hidden overflow-y-scroll px-1"
		style="
			height: calc(100vh - {inputHeight}px - 3rem);
		"
	>
		<div class="flex h-fit w-full flex-col justify-end px-1">
			{#if gameState.chat.chat_messages.length > 0}
				{#each gameState.chat.chat_messages as message}
					<ChatMessageBubble {message} />
				{/each}
			{/if}
			<ChatInput bind:dom={chatInput} {onsend} />
		</div>
	</div>
{/if}

<Dialog title={sysState.uiTexts.HOW_TO_USE} bind:open={showInfo} class="flex-col text-black text-xs">
	{@html sysState.uiTexts.CHATROOM_TUTOR}
</Dialog>
