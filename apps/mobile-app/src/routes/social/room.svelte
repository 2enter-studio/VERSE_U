<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	import { agreeFriendShip, getMemberFromChat } from './utils';
	import { ChatMessageBubble, ChatInput } from './';
	import { authState, sysState, gameState } from '@/states';
	import { Avatar, Dialog, MenuToggler } from '@/components';
	import { watch } from 'runed';
	import moment from 'moment';

	let messagePool = $state<HTMLDivElement>();
	let showInfo = $state(false);

	onMount(() => {
		if (!gameState.chat_id || !authState.user?.id) return;
		onsend();
	});

	watch(() => gameState.chat?.chat_messages.length, onsend);

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
		class="full-screen flex flex-col justify-between bg-black/60 pt-[var(--safe-area-inset-top)]"
	>
		<div class="flex h-12 w-full flex-row items-center justify-between gap-1 bg-black px-1 py-2">
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
		<div bind:this={messagePool} class="w-screen overflow-x-hidden overflow-y-scroll px-1">
			<div class="flex h-fit w-full flex-col justify-end">
				{#if gameState.chat.chat_messages.length > 0}
					{@const messages = gameState.chat.chat_messages}
					{#each messages as message, i}
						{@const sameSender = message.sender === messages[i - 1]?.sender}
						{@const sameDate =
							moment(message.created_at).format('YYYY-MM-DD') ===
							moment(messages[i - 1]?.created_at).format('YYYY-MM-DD')}
						{@const sameMinute =
							moment(message.created_at).format('hh-mm') ===
								moment(messages[i - 1]?.created_at).format('hh-mm') && sameDate}
						<ChatMessageBubble {message} showAvatar={!sameSender} />
					{/each}
				{/if}
			</div>
		</div>
		<ChatInput {onsend} />
	</div>
{/if}

<Dialog
	title={sysState.uiTexts.HOW_TO_USE}
	bind:open={showInfo}
	class="flex-col text-xs text-black"
>
	{@html sysState.uiTexts.CHATROOM_TUTOR}
</Dialog>
