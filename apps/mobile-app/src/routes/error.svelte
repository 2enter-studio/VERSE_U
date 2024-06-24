<script lang="ts">
	import Icon from '@iconify/svelte';
	import { generalState } from '@/states';
	import { Dialog } from '@/components';
</script>

<Dialog
	open={generalState.errorMessage !== ''}
	onclose={() => (generalState.errorMessage = '')}
	title={generalState.uiTexts.error}
	class="center-content text-center text-black"
>
	<Icon icon="mdi:error" class="text-red-500" />
	{generalState.errorMessage}
</Dialog>
