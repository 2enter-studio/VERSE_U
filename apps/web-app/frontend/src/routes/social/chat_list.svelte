<script lang="ts">
	import { gameState } from '@/states';
	// import { getMemberFromChat } from './utils';
	import { Avatar } from '@/components';

	type Props = { chatrooms: ChatRoom[] };

	let { chatrooms }: Props = $props();
</script>

<div
	class="flex h-full w-full flex-col gap-2 rounded-t-2xl border-x-[5px] border-orange-500 bg-yellow-100 px-2 py-2"
>
	{#each chatrooms as chatroom}
		<!-- {@const person = getMemberFromChat(chatroom)?.user} -->
		<button
			class="flex flex-row items-center gap-1 rounded-xl bg-amber-400 text-black shadow-inner shadow-amber-700"
			onclick={() => (gameState.chat_id = chatroom.id)}
		>
			<!-- {#if person}
				<Avatar profile={person} class="my-1 ml-1 size-10" />
			{/if}
			<span class="flex flex-col items-start">
				<small class="font-bold">{person?.name ?? 'Unknown'}</small>
				<small class="text-xs">
					{gameState.chats
						.find((c) => c.id === chatroom.id)
						?.chat_messages.at(-1)
						?.content.slice(0, 15)}
				</small>
			</span> -->
		</button>
	{/each}
</div>
