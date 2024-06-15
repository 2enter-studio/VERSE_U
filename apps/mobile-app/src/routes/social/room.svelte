<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	import { agreeFriendShip } from '@/utils/chat';
	import { ChatMessageBubble, ChatInput } from './';
	import { chat, chatId, user, showMenu, getMemberFromChat, errorMessage } from '@/stores';
	import { Avatar } from '@/components';

	let chatInput = $state<HTMLElement>();
	let messagePool = $state<HTMLDivElement>();

	const inputHeight = $derived(chatInput?.clientHeight ?? 0);

	onMount(() => {
		if (!$chat?.id || !$user?.id) return;
		onsend();
		$showMenu = false;
		return () => {
			$showMenu = true;
		};
	});

	$effect(() => {
		if ($chat?.chat_messages) onsend();
	});

	function onsend() {
		setTimeout(() => {
			if (messagePool) messagePool.scroll({ top: messagePool.scrollHeight });
			else console.log('no message pool found');
		});
	}
</script>

{#if $chat}
	{@const person = getMemberFromChat($chat)}
	{@const me = getMemberFromChat($chat, 'me')}
	<div class="fixed flex h-12 w-full gap-1 bg-black px-1 py-2 text-2xl">
		<button onclick={() => ($chatId = null)}>
			<Icon icon="mdi:arrow-back" />
		</button>
		<Avatar profile={person?.profiles} class="size-8" />
		{#if $chat.chat_messages.some((m) => m.sender === $user?.id) && $chat.chat_messages.some((m) => m.sender === person?.profiles?.user) && !me?.agree}
			<div class="center-content">
				<span class="text-xs">add to friends?</span>
				<button
					class="bg-white px-1 text-xs text-black"
					onclick={async () => {
						const result = await agreeFriendShip();
						if (result?.error) {
							$errorMessage = result.error.message;
							console.error(result.error);
						} else console.log('yeah!');
					}}
				>
					YES
				</button>
			</div>
		{/if}
	</div>
	<div
		bind:this={messagePool}
		class="mt-12 w-screen overflow-x-hidden overflow-y-scroll px-1"
		style="
			height: calc(100vh - {inputHeight}px - 3rem);
		"
	>
		<div class="flex h-fit w-full flex-col justify-end px-1">
			{#if $chat.chat_messages.length > 0}
				{#each $chat.chat_messages as message}
					<ChatMessageBubble {message} />
				{/each}
			{/if}
			<ChatInput bind:dom={chatInput} {onsend} />
		</div>
	</div>
{/if}
