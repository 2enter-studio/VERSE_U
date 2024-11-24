<script lang="ts">
	import { Dialog, FadeOutUp, SubmitBtn } from '@/components';
	import { clockInState, unergyState } from '@/states';
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
  const clockIn = clockInState.clockIn
  if (clockIn) {
    const clockInToday = clockIn[dayOfWeek as keyof typeof clockIn];
    if (!clockInToday) {
      notClockedInYet = true;
    } 
  }
}

function onSubmit() {
  if(!clockInState.clockIn) return notClockedInYet = false
  const today = new Date().toISOString().split('T')[0]
  clockInState.setClockIn({...clockInState.clockIn, [dayOfWeek as keyof typeof clockInState.clockIn]: today});
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

function getResetDate(date: Date) {
  const resetDate = new Date(date);
  const dayOfWeek = date.getDay();
  resetDate.setDate(date.getDate() - dayOfWeek + 7);
  resetDate.setHours(0, 0, 0, 0);
  return resetDate;
}

onMount(() => {
  const currentDate = new Date()
  const resetDate = getResetDate(currentDate);
  let needReset = true;
  for (let day in clockInState.clockIn) {
      if (clockInState.clockIn[day]) {
          const signInDate = new Date(clockInState.clockIn[day]);
          if (signInDate >= resetDate - 7 * 24 * 60 * 60 * 1000) {
              needReset = false;
              break;
          }
      }
  }
  if (needReset) {
    for (let day in clockInState.clockIn) {
        clockInState.setClockIn({...clockInState.clockIn, [day]: null})
    }
  }
})

$effect.root(checkClockIn);

</script>
{#if clockInState.clockIn}
  <Dialog title="每日簽到" bind:open={notClockedInYet} class="flex-col gap-2 justify-center items-center relative">
    <div class="flex flex-row gap-2 flex-wrap justify-center items-center">
      
      {#each weekDays as day, index}
        {@const checked = Boolean(clockInState.clockIn[day])}
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