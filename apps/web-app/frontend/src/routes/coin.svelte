<script lang="ts">

  let { unergy } = $props();
</script>

<div class="ml-2 flex items-center border border-black rounded-2xl w-fit bg-black bg-opacity-50">
  <div class="w-6 h-6 mr-1 relative rounded-full bg-[#ffd9b3] flex justify-center items-center">
    <span class="text-[#c49a44] text-sm">U</span>
  </div>
  <span class="text-white text-sm px-2 py-1 rounded-md">{unergy}</span>
</div>
