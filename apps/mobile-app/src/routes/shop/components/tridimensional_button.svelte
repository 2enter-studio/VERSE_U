<script lang="ts">
  let { onBuy, text, disabled }: { onBuy: () => void, text: string, disabled: boolean } = $props()
</script>
<div class="relative">
  <div class="absolute w-20 h-[2.5rem] bg-[#df7876] rounded-[10px_10px_15px_15px] top-3 {disabled ? 'bg-gray-500' : ''}"></div>
  <div class="absolute w-20 h-[2.5rem] opacity-15 bg-[#df7876] rounded-[10px_10px_15px_15px] top-[15px] left-[-4px] {disabled ? 'bg-gray-500' : ''}"></div>
  <button class="w-20 border-none text-[#efefef] bg-[#fb7475] py-3 px-6 rounded-[15px] text-base font-medium transform transition-transform ease-in-out duration-250 focus-visible:translate-y-[6px] active:translate-y-[6px] disabled:bg-gray-300 disabled:cursor-not-allowed" onclick={onBuy} disabled={disabled}>
    {text}
  </button>
    
  </div>