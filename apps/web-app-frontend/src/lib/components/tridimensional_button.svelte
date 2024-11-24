<script lang="ts">
  let { onClick, text, disabled, style }: { onClick: () => void, text: string, disabled: boolean, style?: string } = $props()
  const buttonStyle = style ? style : 'w-20'
</script>
<div class="relative">
  <div class="absolute {buttonStyle} h-[2.5rem] bg-[#df7876] rounded-[10px_10px_15px_15px] top-3 {disabled ? 'bg-gray-500' : ''}"></div>
  <div class="absolute {buttonStyle} h-[2.5rem] opacity-15 bg-[#df7876] rounded-[10px_10px_15px_15px] top-[15px] left-[-4px] {disabled ? 'bg-gray-500' : ''}"></div>
  <button class="{buttonStyle} border-none text-[#efefef] bg-[#fb7475] py-3 px-6 rounded-[15px] text-base font-medium transform transition-transform ease-in-out duration-10 focus-visible:translate-y-[6px] active:translate-y-[6px] focus:pointer-events-auto disabled:bg-gray-300 disabled:cursor-not-allowed" onclick={onClick} disabled={disabled}>
    {text}
  </button>
    
  </div>