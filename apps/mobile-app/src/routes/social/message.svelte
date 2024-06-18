<script lang="ts">
	import moment from 'moment';
	import { fly } from 'svelte/transition';
	import { user, chat } from '@/stores';
	import { Avatar } from '@/components';
	import type { Tables } from '@repo/supabase';

	export let message: Tables<'chat_messages'>;
	const isMine = message.sender === $user?.id;

	const dateTimeClassName = 'mx-1 mb-0.5 text-[9.5px] tracking-tighter text-black/70';
</script>

{#if $chat}
	<div
		in:fly={{ x: isMine ? 100 : -100, duration: 70 }}
		class="my-[3px] flex w-full flex-row items-end {isMine ? 'justify-end' : 'justify-start'}"
	>
		{#if !isMine}
			{@const profile = $chat.chat_members.find(
				(m) => m.profiles.user === message.sender
			)?.profiles}
			<Avatar {profile} class="mr-1 size-9" />
			<!--		<div class="mr-2 size-12 rounded-full bg-rose-400"></div>-->
		{/if}
		{#if isMine}
			{@const date = new Date(message.created_at)}
			<small class={dateTimeClassName}>{moment(date).format('hh:mm A')}</small>
		{/if}
		<span
			class="{isMine
				? 'border-r-2 border-orange-600 bg-yellow-100'
				: 'border-l-2 border-cyan-600 bg-cyan-50'} h-fit max-w-[50vw] overflow-auto break-all rounded-xl border-b-2 px-3 py-1 text-sm text-black"
		>
			{@html message.content.replaceAll('\n', '<br />')}
		</span>

		{#if !isMine}
			{@const date = new Date(message.created_at)}
			<small class={dateTimeClassName}>{moment(date).format('hh:mm A')}</small>
		{/if}
	</div>
{/if}
