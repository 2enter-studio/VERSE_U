<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { db } from '@/db';
	import { subscribeToRegion } from '@/utils/map';
	import { startChat, subscribeToAgree, subscribeToMessages } from '@/utils/chat';

	import { chat, chatId, friends, strangers, peopleNearby, general } from '@/states';
	import { Chatroom, ChatList, Story } from './';
	import { Avatar, Dialog } from '@/components';

	const chatTypes = ['friends', 'strangers'] as const;
	let selectedChatType = $state<(typeof chatTypes)[number]>('strangers');
	let storyUserId = $state('');
	let startingNewChat = $state(false);
	let firstMessage = $state('');

	onMount(() => {
		subscribeToMessages();
		subscribeToAgree();
		subscribeToRegion((payload) => {
			const userLeave = payload.new.user;
			console.log('User is leaving: ', userLeave);
			if (!$peopleNearby) return;
			$peopleNearby = $peopleNearby.filter((person) => person.user !== userLeave);
		});

		return () => {
			db.realtime.disconnect();
			console.log('connection status: ', db.realtime.connectionState());
		};
	});
</script>

{#if $chat}
	<Chatroom />
{:else}
	<div class="center-content mb-3 mt-12 flex-col">
		<h1>{general.uiTexts.people_nearby}</h1>
		<div class="flex w-[88vw] flex-row gap-2">
			{#each $peopleNearby as person, i}
				{@const friend = $friends.find((f) =>
					f.chat_members.some((c) => c.profiles.user === person.user)
				)}
				{@const stranger = $strangers.find((s) =>
					s.chat_members.some((c) => c.profiles.user === person.user)
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
							if (i + 1 < $peopleNearby.length) storyUserId = $peopleNearby[i + 1].user;
							else storyUserId = '';
						}}
						previous={() => {
							if (i - 1 >= 0) storyUserId = $peopleNearby[i - 1].user;
							else storyUserId = '';
						}}
						startChat={() => {
							if (friend) $chatId = friend.id;
							else if (stranger) $chatId = stranger.id;
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
					{general.uiTexts[option]}
				</label>
			{/each}
		</div>
		{#if selectedChatType === 'friends'}
			<ChatList chatrooms={$friends} />
		{:else}
			<ChatList chatrooms={$strangers} />
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
				if (res?.error) general.errorMessage = res.error.message;
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
