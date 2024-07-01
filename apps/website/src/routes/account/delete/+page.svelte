<script lang="ts">
  import { enhance } from '$app/forms';
  import type {SubmitFunction} from '@sveltejs/kit';

  let errorMessage = $state<string>()

  const enhanceHandler: SubmitFunction = () => {
    if (!confirm('Are you sure?')) return
    return async ({result, update}) => {
      await update()
      if (result.type === 'failure') {
        errorMessage = result.data?.error
      } else {
        alert('成功! Success!')
      }
    }
  }
</script>

<div class="flex justify-center items-center text-center h-screen">
  <div class="flex flex-col">
    <h1 class="text-2xl font-bold">刪除我的帳號</h1>
    <h1 class="text-2xl font-bold">Delete My Account</h1>
    <form action="?/remove" method="POST" class="flex flex-col gap-1 justify-center items-center" use:enhance={enhanceHandler}>
      <label for="email">E-mail</label>
      <input type="email" name="email" id="email" required>
      <label for="password">密碼 Password</label>
      <input type="password" name="password" id="password" required>
      <label for="public_id">Public ID</label>
      <input type="text" name="public_id" id="public_id" required>
      <span class="text-rose-500">{errorMessage}</span>
      <button type="submit" class="bg-white text-black py-1 px-2 rounded-xl">submit</button>
    </form>
  </div>
</div>
