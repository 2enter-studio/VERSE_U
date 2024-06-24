<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { db } from '@/db';
	import { subscribeToRegion } from '@/utils/map';
	import { startChat, subscribeToAgree, subscribeToMessages } from '@/utils/chat';

	import { gameState, generalState } from '@/states';
	import { Chatroom, ChatList, Story } from './';
	import { Avatar, Dialog } from '@/components';

	const chatTypes = ['friends', 'strangers'] as const;
	let selectedChatType = $state<(typeof chatTypes)[number]>('strangers');
	let storyUserId = $state('');
	let startingNewChat = $state(false);
	let firstMessage = $state('');

	$inspect(gameState.friendChats, gameState.strangerChats);
	onMount(() => {
		subscribeToMessages();
		subscribeToAgree();
		subscribeToRegion((payload) => {
			const userLeave = payload.new.user;
			console.log('User is leaving: ', userLeave);
			if (!gameState.peopleNearBy) return;
			gameState.peopleNearBy = gameState.peopleNearBy.filter((person) => person.user !== userLeave);
		});

		return () => {
			db.realtime.disconnect();
			console.log('connection status: ', db.realtime.connectionState());
		};
	});
</script>

{#if gameState.chat}
	<Chatroom />
{:else}
	<div class="center-content mb-3 mt-12 flex-col">
		<h1>{generalState.uiTexts.people_nearby}</h1>
		<div class="flex w-[88vw] flex-row gap-2">
			{#each gameState.peopleNearBy as person, i}
				{@const friend = gameState.friendChats.find((f) =>
					f.chat_members.some((c) => c.user.user === person.user)
				)}
				{@const stranger = gameState.strangerChats.find((s) =>
					s.chat_members.some((c) => c.user.user === person.user)
				)}

				<button
					onclick={() => {
						storyUserId = person.user;
					}}
				>
					<Avatar profile={person} />
				</button>
				{#if storyUserId === person.user}
					<Story
						user_id={person.user}
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
				{/if}
			{/each}
		</div>
	</div>
	<div class="b flex h-full w-[88vw] flex-col items-start justify-center">
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
					{generalState.uiTexts[option]}
				</label>
			{/each}
		</div>
		{#if selectedChatType === 'friends'}
			<ChatList chatrooms={gameState.friendChats} />
		{:else}
			<ChatList chatrooms={gameState.strangerChats} />
		{/if}
	</div>
{/if}

<Dialog title="start" bind:open={startingNewChat} class="center-content">
	<input
		bind:value={firstMessage}
		class="rounded-lg bg-black text-white"
		id="first-message"
		type="text"
	/>
	<button
		onclick={() => {
			if (firstMessage.trim() === '') return;
			startChat(storyUserId, firstMessage).then((res) => {
				if (res?.error) generalState.errorMessage = res.error.message;
				else {
					startingNewChat = false;
					storyUserId = '';
				}
			});
		}}
	>
		<Icon icon="mingcute:send-plane-fill" class="size-10 rounded-full text-cyan-800" />
	</button>
</Dialog>

<style>
	h1 {
		font-weight: bolder;
	}
</style>
