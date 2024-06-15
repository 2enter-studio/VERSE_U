<script lang="ts">
	import Icon from '@iconify/svelte';
	import { errorMessage, uiTexts } from '@/stores';
	import { Dialog } from '@/components';
</script>

<Dialog open={$errorMessage !== ''} onclose={() => ($errorMessage = '')} title={$uiTexts.error} class="center-content text-center text-black">
	<Icon icon="mdi:error" class="text-red-500" />
	{$errorMessage}
</Dialog>
