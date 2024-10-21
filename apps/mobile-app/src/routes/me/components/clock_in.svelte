<script lang="ts">
	import { Dialog, FadeOutUp, SubmitBtn } from '@/components';
	import { authState, clockInState, unergyState } from '@/states';
	import Icon from '@iconify/svelte';
	import { CoinAnimation, CheckAnimation } from '.';
	import { onMount } from 'svelte';

const weekDays = ['sun','mon', 'tue', 'wed', 'thu', 'fri',  'sat'];
const weekDaysName = ['日', '一', '二', '三', '四', '五', '六'];

let notClockedInYet = $state(false);
let clockinAnimation = $state(false);
const everyDayClockIn = $derived.by(() => Object.values(clockInState.clockIn).every(value => Boolean(value) === true))
const fadeOutUpText = $derived.by(() => {
  return everyDayClockIn ? '+100' : '+50'
})
const dayOfWeek = $derived(weekDays[new Date().getDay()])
function checkClockIn() {
  const clockIn = authState.profile?.clock_in;
  if (clockIn) {
    const clockInToday = clockIn[dayOfWeek as keyof typeof clockIn];
    if (!clockInToday) {
      notClockedInYet = true;
    } 
  }
}

function onSubmit() {
  if(!clockInState.clockIn) return notClockedInYet = false
  clockInState.setClockIn({...clockInState.clockIn, [dayOfWeek as keyof typeof clockInState.clockIn]: new Date().toISOString().split('T')[0]});
    if (dayOfWeek === 'sat' && Object.values(clockInState.clockIn).every(value => Boolean(value) === true)) {
      unergyState.addUnergy(100)
    } else {
      unergyState.addUnergy(50)
    }
    clockinAnimation = true
    setTimeout(() => {
      clockinAnimation = false
      notClockedInYet = false;
    }, 1800)
    
}

onMount(() => {
  const today = new Date().toISOString().split('T')[0]
  if(dayOfWeek === 'sun' && clockInState.clockIn?.sun !== today) {
    // reset clockIn
    clockInState.setClockIn({
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null
    })
  }
})

$effect.root(checkClockIn);

</script>
{#if clockInState.clockIn}
  <Dialog title="每日簽到" bind:open={notClockedInYet} class="flex-col gap-2 justify-center items-center relative">
    <div class="flex flex-row gap-2 flex-wrap justify-center items-center">
      
      {#each weekDays as day, index}
        {@const checked = clockInState.clockIn[day]}
        <div class="w-16 h-30 p-2 {checked ? 'bg-black' : 'bg-white'} bg-opacity-50 rounded-lg flex flex-col justify-center items-center shadow-inner {checked ? 'text-white' : 'text-gray-500'}">
          {#if day === dayOfWeek && clockinAnimation} 
            <CheckAnimation />
          {:else if !checked}
            <Icon icon="ic:outline-circle" class="w-10 h-10 text-inherit" />
          {:else}
            <Icon icon="gg:check-o" class="w-10 h-10 text-inherit" />
          {/if}
          
          {checked ? '已簽到' : '未簽到'}
          <span class="text-inherit text-xs">{weekDaysName[index]}</span>
          <div class="text-inherit text-xs flex flex-row gap-1 items-center"> {index === weekDays.length - 1 ? '+ ???' : '+ 50'}<Icon icon="mingcute:coin-fill" class="w-4 h-4" /></div>
        </div>
      {/each}
    </div>
    <div class="relative" >
      {#if clockinAnimation}
        <CoinAnimation />
        <FadeOutUp text={fadeOutUpText} class="absolute -top-6 text-yellow-500"/>
      {/if}
      <SubmitBtn class="rounded-md bg-emerald-500 px-2 py-1 shadow-inner shadow-black/30 w-40" onclick={onSubmit}>簽到</SubmitBtn>
    </div>
  </Dialog>
  
{/if}
<style>

</style>