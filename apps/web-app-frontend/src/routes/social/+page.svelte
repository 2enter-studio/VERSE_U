<script lang="ts">
	import Icon from '@iconify/svelte';

	// import { startNewChat } from './utils';

	import { gameState, sysState, unergyState } from '@/states';
	import { ChatList, Chatroom, Story } from './';
	import { Avatar, Dialog } from '@/components';

	const chatTypes = ['FRIENDS', 'STRANGERS'] as const;
	let selectedChatType = $state<(typeof chatTypes)[number]>('STRANGERS');
	let storyUserId = $state('');
	let startingNewChat = $state(false);
	let firstMessage = $state('');

	$effect(() => {
		if (gameState.chat_id) storyUserId = '';
	});

	// async function startChat() {
	// 	if (firstMessage.trim() === '') return;
	// 		const result = await startNewChat(storyUserId, firstMessage);
	// 		if (result?.error) {
	// 			sysState.defaultError('OPERATION_FAILED');
	// 		} else {
	// 			startingNewChat = false;
	// 			storyUserId = '';
	// 			unergyState.subUnergy(50);
	// 		}
	// }
</script>

{#if gameState.chat}
	<Chatroom />
{:else}
	<div class="center-content mb-3 mt-12 flex-col gap-2 shepherd-social-players">
		<h1>{sysState.uiTexts.PEOPLE_NEARBY}</h1>
		<div class="w-[88vw] overflow-x-auto">
			<div class="flex flex-row gap-2 w-fit">
				{#each gameState.peopleNearBy as person, i}
					{@const friend = gameState.friendChats.find((f) =>
						f.chat_members.some((c) => c.user.user === person.user)
					)}
					{@const stranger = gameState.strangerChats.find((s) =>
						s.chat_members.some((c) => c.user.user === person.user)
					)}

					<button
						class="center-content w-[15vw] flex-col rounded-md bg-black/30 p-1 backdrop-blur-sm shepherd-social-player-story relative"
						onclick={() => {
							storyUserId = person.user;
						}}
					>
						<div class="pulsing"></div>
						<Avatar profile={person} noInfo />
						<small class="text-xs">{person.name}</small>
					</button>
					<!-- {#if storyUserId === person.user}
						<Story
							{person}
							close={() => (storyUserId = '')}
							next={() => {
								if (i + 1 < gameState.peopleNearBy.length)
									storyUserId = gameState.peopleNearBy[i + 1].user;
								else storyUserId = '';
							}}
							previous={() => {
								if (i - 1 >= 0) storyUserId = gameState.peopleNearBy[i - 1].user;
								else storyUserId = '';
							}}
							startChat={() => {
								if (friend) gameState.chat_id = friend.id;
								else if (stranger) gameState.chat_id = stranger.id;
								else startingNewChat = true;
							}}
						/>
					{/if} -->
				{/each}
			</div>
		</div>
	</div>
	<div class="b flex h-full w-[88vw] flex-col items-start justify-center shepherd-social-chats">
		<div class="flex w-full flex-row justify-between">
			{#each chatTypes as option}
				<input
					type="radio"
					id="option-{option}"
					value={option}
					bind:group={selectedChatType}
					hidden
				/>
				{@const selected = option === selectedChatType}
				<label
					for="option-{option}"
					class="mx-4 w-1/3 rounded-t-xl bg-yellow-100 text-center font-bold text-black transition-all duration-100 {selected
						? 'bg-opacity-100'
						: 'bg-opacity-60 shadow-inner shadow-yellow-800/40'}"
				>
					{sysState.uiTexts[option]}
				</label>
			{/each}
		</div>
		{#if selectedChatType === 'FRIENDS'}
			<ChatList chatrooms={gameState.friendChats} />
		{:else}
			<ChatList chatrooms={gameState.strangerChats} />
		{/if}
	</div>
{/if}

<Dialog title={sysState.uiTexts.START_CHAT} bind:open={startingNewChat} class="center-content flex flex-col gap-2 text-center">
	這是你第一次與這位過客聊天，需要耗費 50 點 U-nergy。
	{#if unergyState.unergy < 50}
		<small class="text-red-500">U-nergy 不足</small>
	{/if}
	<div class="flex flex-row gap-2">
	<input
		bind:value={firstMessage}
		class="rounded-lg bg-black text-white w-60"
		id="first-message"
		type="text"
	/>
	<button
		class="disabled:opacity-50"
	  disabled={unergyState.unergy < 50}
		onclick={startChat}
	>
		<Icon icon="mingcute:send-plane-fill" class="size-10 rounded-full text-cyan-800" />
		</button>
	</div>
</Dialog>

<style>
	h1 {
		font-weight: bolder;
	}
</style>
