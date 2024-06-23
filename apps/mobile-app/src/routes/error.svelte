<script lang="ts">
	import Icon from '@iconify/svelte';
	import { general } from '@/states';
	import { Dialog } from '@/components';
</script>

<Dialog
	open={general.errorMessage !== ''}
	onclose={() => (general.errorMessage = '')}
	title={general.uiTexts.error}
	class="center-content text-center text-black"
>
	<Icon icon="mdi:error" class="text-red-500" />
	{general.errorMessage}
</Dialog>
