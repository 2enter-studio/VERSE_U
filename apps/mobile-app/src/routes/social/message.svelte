<script lang="ts">
	import moment from 'moment';
	import { fly } from 'svelte/transition';
	import { authState, gameState } from '@/states';
	import { Avatar, Dialog, Form, SubmitBtn } from '@/components';
	import type { Tables } from '@repo/shared/supatypes';
	import { HoldBtn } from '@/components/index.js';

	type Props = { message: Tables<'chat_messages'> };
	let { message }: Props = $props();

	let openInfo = $state(false);

	const isMine = message.sender === authState.user?.id;
	const dateTimeClassName = 'mx-1 mb-0.5 text-xs tracking-tighter text-white/70';
</script>

{#if gameState.chat}
	<div
		in:fly={{ x: isMine ? 100 : -100, duration: 70 }}
		class="my-[3px] flex w-full flex-row items-end {isMine ? 'justify-end' : 'justify-start'}"
	>
		{#if !isMine}
			{@const profile = gameState.chat.chat_members.find(
				(m) => m.user.user === message.sender
			)?.user}
			{#if profile}
				<Avatar {profile} class="mr-1 size-9" noInfo />
			{/if}
		{/if}

		{#if isMine}
			<small class={dateTimeClassName}>{moment(message.created_at).format('hh:mm A')}</small>
		{/if}
		<HoldBtn trigger={() => (openInfo = true)} disabled={isMine}>
			<span
				class="{isMine
					? 'border-r-2 border-orange-600 bg-yellow-100'
					: 'border-l-2 border-cyan-600 bg-cyan-50'}
				 h-fit max-w-[50vw] overflow-auto break-all rounded-xl border-b-2 px-3 py-1 text-sm text-black"
			>
				{@html message.content.replaceAll('\n', '<br />')}
			</span>
		</HoldBtn>

		{#if !isMine}
			<small class={dateTimeClassName}>{moment(message.created_at).format('hh:mm A')}</small>
		{/if}
	</div>
{/if}

<Dialog title="message info" bind:open={openInfo}>
	<Form
		submitFunction={() => {
			openInfo = false;
		}}
	>
		<input type="text" name="id" value={message.id} hidden />
		<SubmitBtn class="rounded-lg bg-rose-600 px-2 py-1 text-white">Report</SubmitBtn>
	</Form>
</Dialog>
