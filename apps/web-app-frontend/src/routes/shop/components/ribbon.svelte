<script lang="ts">
  let { title }: { title: string } = $props()
</script>

  <div class="relative mx-auto mb-5 p-2.5 px-10 text-center bg-[#875e46] inline-block">
    <span class="absolute top-[20px] left-[-60px] w-20 h-full bg-[#724b34] clip-ribbon-end bg-gradient-ribbon -z-10"></span>
    <h1 class="text-white text-2xl font-bold">{title}</h1>
    <span class="absolute top-[20px] right-[-60px] w-20 h-full bg-[#724b34] clip-ribbon-end bg-gradient-ribbon transform scale-x-[-1] -z-10"></span>
</div>


<style>
  .clip-ribbon-end {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 25% 50%);
}

.bg-gradient-ribbon {
  background-image: linear-gradient(45deg, transparent 50%, #5d3922 50%);
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: bottom right;
}
</style>
