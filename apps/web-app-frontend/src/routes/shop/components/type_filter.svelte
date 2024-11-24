<script lang="ts">
  const { type, onClick }: {type: string, onClick: (type: string) => void} = $props()
  let checked = $state(true)
</script>

<div class="relative">
  <div class="absolute w-[4.5rem] h-10 { checked ? 'bg-green-800' : 'bg-[#34425c]'} rounded-[10px_10px_15px_15px] top-1 transition-all left-[6px] ease-in-out duration-250"></div>
  <div class="absolute w-[4.5rem] h-10 opacity-15 { checked ? 'bg-green-800' : 'bg-[#34425c]'} rounded-[10px_10px_15px_15px] top-1 transition-all ease-in-out duration-250"></div>
  <label class="flex items-center justify-center">
    <div class="w-[4.5rem] border-none text-[#efefef]  py-3 px-6 rounded-[15px] text-xs transform transition-all 
    ease-in-out duration-250 {checked ? 'bg-green-500' : '-translate-y-1 bg-[#3f4d66]'} z-10">
    <input class="hidden" type="checkbox" onchange={() => onClick(type) } bind:checked={checked}/>
    {type}
    </div>
  </label>
</div>