<script lang="ts">
	import moment from 'moment';
	import { fly } from 'svelte/transition';
	import { authState, gameState, sysState } from '@/states';
	import { Avatar, Dialog, Form, SubmitBtn } from '@/components';
	import type { Tables } from '@repo/shared/supatypes';
	import { HoldBtn } from '@/components/index.js';
	import { reportMessage } from '$routes/social/utils';

	type Props = { message: Tables<'chat_messages'>; showAvatar?: boolean; showTime?: boolean };
	let { message, showAvatar = true, showTime = true }: Props = $props();

	let openInfo = $state(false);

	const isMine = message.sender === authState.user?.id;
	const dateTimeClassName = 'mx-1 mb-1 text-xs tracking-tighter text-white/70';
</script>

{#if gameState.chat}
	<div
		in:fly={{ x: isMine ? 100 : -100, duration: 70 }}
		class="my-[3px] flex w-full flex-row items-end {isMine ? 'justify-end' : 'justify-start'}"
	>
		{#if !isMine && showAvatar}
			{@const profile = gameState.chat.chat_members.find(
				(m) => m.user.user === message.sender
			)?.user}
			{#if profile}
				<Avatar {profile} class="mr-1 size-9" noInfo />
			{/if}
		{:else}
			<div class="w-10"></div>
		{/if}

		{#if isMine && showTime}
			<small class={dateTimeClassName}>{moment(message.created_at).format('HH:mm')}</small>
		{/if}
		<HoldBtn trigger={() => (openInfo = true)} disabled={isMine}>
			<div
				class="{isMine
					? 'border-r-2 border-orange-600 bg-yellow-100'
					: 'border-l-2 border-cyan-600 bg-cyan-50'}
				 h-fit max-w-[70vw] whitespace-pre-wrap break-all rounded-xl border-b-2 px-3 py-1 text-sm text-black"
			>
				{message.content}
			</div>
		</HoldBtn>

		{#if !isMine && showTime}
			<small class={dateTimeClassName}>{moment(message.created_at).format('HH:mm')}</small>
		{/if}
	</div>
{/if}

<Dialog title={sysState.uiTexts.REPORT} bind:open={openInfo}>
	<Form submitFunction={reportMessage}>
		<h1>{sysState.uiTexts.ENTER_REPORT_REASON}</h1>
		<input type="text" name="message_id" value={message.id} hidden />
		<input type="text" name="reason" placeholder="Enter your reason" class="rounded-xl" required />
		<SubmitBtn class="rounded-lg bg-rose-600 px-2 py-1 text-white">
			{sysState.uiTexts.SUBMIT}
		</SubmitBtn>
	</Form>
</Dialog>
