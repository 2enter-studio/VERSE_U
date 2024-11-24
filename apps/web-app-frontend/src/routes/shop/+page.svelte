<script lang="ts">
import { gameState, unergyState } from '@/states';
import { Wearing, Ribbon, TypeFilter } from './components';
import { Dialog } from '@/components';
import { buyWearing } from '$routes/me/utils';
const wearingTypes = gameState.wearingTypes
const ownedWearings = gameState.owned_wearings

let selectedTypes = $state<string[]>(wearingTypes.map(t => t.name))

let wearingItems = $derived.by(
	() => {
		return gameState.wearings.filter(w => !ownedWearings.some(ow => ow.id === w.id)).filter(w => selectedTypes.length === 0 || selectedTypes.includes(w.category.name))
	}
)

let confirm = $state(false)
let wearing = $state<any>(null)
let bought = $state(false)

function buy(selectedWearing: any) {
  wearing = selectedWearing
  confirm = true
}

function handleSubmit() {
	confirm = false
	bought = true
	setTimeout(() => {
		bought = false
		buyWearing(wearing.id)
		unergyState.subUnergy(wearing.price)
	}, 1800)
}

function toggleType(value: string) {
  const index = selectedTypes.indexOf(value);
	if (index > -1) {
		selectedTypes = selectedTypes.filter(t => t !== value)
	} else {
		selectedTypes = [...selectedTypes, value]
	}
}

</script>
<div class="h-full flex flex-col">
	<div class="w-full pointer-events-none flex flex-col gap-2 px-2 *:pointer-events-auto mt-10 h-[calc(100%-10rem)]">
		<Ribbon title="商店" />
		<div class="grid grid-cols-4 gap-2 flex-wrap my-5">
			{#each wearingTypes as type}
				<TypeFilter type={type.name} onClick={(value) => toggleType(value)} />
			{/each}
		</div>
		<div class="relative grid grid-cols-2 justify-between gap-2 overflow-y-auto scrolling-touch">
			{#each wearingItems as item}
				<Wearing wearing={item} onBuy={() => buy(item)} bought={bought && item.id === wearing?.id}/>
			{/each}
		</div>
	</div>
	{#if confirm}
	<Dialog
			title="購買"
			closable={false}
			class="center-content flex-col text-center"
		>
			你確定要購買此服裝嗎？
			<div class="flex flex-row gap-2">
			<button
				type="button"
				onclick={() => confirm = false}
				class="w-fit text-white rounded-xl bg-red-500 px-2 py-1 shadow-inner shadow-black/30"
			>
				取消
			</button>
			<button
				class="w-fit text-white rounded-xl bg-emerald-500 px-2 py-1 shadow-inner shadow-black/30"
				onclick={handleSubmit}
			>
				購買
			</button>
			</div>
		</Dialog>
	{/if}
</div>

<style>


</style>