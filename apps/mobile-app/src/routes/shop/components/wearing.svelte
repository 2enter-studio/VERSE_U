<script lang="ts">
	import { FadeOutUp, LocalImg } from "@/components";
	import Coin from "../../coin.svelte";
	import {TridimensionalButton} from ".";
	import { unergyState } from "@/states";


let { wearing, onBuy, bought }: { wearing: any, onBuy: () => void, bought: boolean } = $props();



</script>
<div class="flex flex-col justify-around items-center w-44 h-72 bg-yellow-100 rounded-md">
  <LocalImg
    bucket="wearings"
    filename="thumbnails/{wearing.id}"
    mimetype="image/webp"
    class="size-36"
    />
    <Coin unergy={wearing.price} />
    <div class="relative">
      {#if bought}
        <FadeOutUp text={`-${wearing.price}`} class="absolute -top-6 text-red-500"/>
      {/if}
      <TridimensionalButton onBuy={onBuy} text="購買" disabled={wearing.price > unergyState.unergy} />
    </div>

</div>
