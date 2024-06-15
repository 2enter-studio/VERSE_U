<script lang="ts">
	import { setPwd, signOut } from '@/utils/auth';
	import validate from '@/utils/validate';
	import config from '@/config';

	const { DEFAULT_ROUTE } = config;

	let pwd = $state('');
	let pwdConfirm = $state('');
	let errMsg = $state('');

	const submittable = $derived(validate.password(pwd) && pwd === pwdConfirm);

	async function handleSubmit() {
		const res = await setPwd(pwd);
		if (res?.error) errMsg = res.error.message;
		await signOut();
		window.location.assign(DEFAULT_ROUTE);
	}
</script>

<form onsubmit={handleSubmit} class="center-content flex-col">
	<label>
		<span>New Password</span>
		<input type="password" id="pwd" bind:value={pwd} required />
	</label>

	<label>
		<span>Confirm Password</span>
		<input type="password" id="pwd-confirm" bind:value={pwdConfirm} required />
	</label>

	<small class="text-red-500">{errMsg}</small>

	{#if submittable}
		<button type="submit">Update password</button>
	{:else}
		<p>Passwords must match and be at least 8 characters long</p>
	{/if}
</form>
