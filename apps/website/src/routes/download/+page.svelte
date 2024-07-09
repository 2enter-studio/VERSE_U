<script lang="ts">
  import {APP_LINKS} from '@repo/shared/config';
</script>

<div class="center-content full-screen flex-col gap-2 text-center">
  <h1>嗨！請於下方點擊您的作業系統 / 運行環境</h1>
  <h1>開始體驗 Verse U 吧！</h1>
  {#each Object.entries(APP_LINKS) as [key, value]}
    <a href={value} class="text-xl" target="_blank">{key}</a>
  {/each}
</div>
