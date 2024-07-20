<script lang="ts" context="module">
	import { db } from '@/db';
	import { handleEFResponse, load } from '@/utils';

	export async function useCoupon(args: { sponsor_id: string }) {
		const { error } = await db.functions.invoke('use-coupon', {
			body: JSON.stringify(args)
		});
		if (error) {
			const err = await handleEFResponse(error);
			console.log(err);
			return { error: err };
		}
		await load.sponsors();
	}
</script>

<script lang="ts">
	import { COUPON_LIMITS } from '@repo/shared/config';
	import { gameState, sysState } from '@/states';
	import { Form, SubmitBtn } from '@/components';

	let selected = $state<Sponsor | null>(null);

	function afterSubmit() {
		selected = gameState.sponsors.find((s) => s.id === selected?.id) ?? null;
	}
</script>

{#if selected}
	<div
		class="full-screen flex items-end justify-center bg-contain bg-center bg-no-repeat pb-[30%] text-2xl"
		style="background-image: url('/images/coupon_{selected.value}.webp')"
	>
		<div class="center-content flex-row gap-2">
			{#if !sysState.processing}
				<button class="bg-gray-300 text-xl text-black" onclick={() => (selected = null)}>
					{'<-' + sysState.uiTexts.CANCEL}
				</button>
			{/if}
			{#if selected.coupons[0]?.used}
				<div class="rounded-xl bg-gray-200 p-2">{sysState.uiTexts.COUPON_USED}</div>
			{:else}
				<Form submitFunction={useCoupon} {afterSubmit} confirmMessage="REDEEM_CONFIRM">
					<input type="text" name="sponsor_id" value={selected.id} hidden />
					<SubmitBtn
						class="center-content flex-col rounded-xl bg-yellow-500 px-7 py-2 text-white shadow-inner shadow-white/30"
					>
						{sysState.uiTexts.REDEEM}
						<small class="text-xs">
							({sysState.uiTexts.COUPON_LIMIT}
							{COUPON_LIMITS[selected.value]}
							{sysState.uiTexts.COUPON_UNIT})
						</small>
					</SubmitBtn>
				</Form>
			{/if}
		</div>
	</div>
{:else}
	{#each gameState.sponsors as sponsor}
		{#if sponsor.coupons.length}
			<button class="bg-black rounded-sm px-2 py-1 text-white" onclick={() => (selected = sponsor)}>
				{sponsor.name}
			</button>
		{/if}
	{/each}
{/if}
