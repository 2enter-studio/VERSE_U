<script lang="ts">
	import moment from 'moment';
	import { sysState } from '@/states';
	import { Dialog, MenuToggler } from '@/components';
	import { DEFAULT_ROUTE } from '@/config';
	import { secToMin } from '@/utils';

	$effect(() => {
		if (!sysState.maintaining) window.location.assign(DEFAULT_ROUTE);
	});
</script>

<MenuToggler />

{#if sysState.maintenance && sysState.maintaining}
	<Dialog
		title="maintenance"
		closable={false}
		open
		class="center-content flex-col text-center text-black"
	>
		<span>VERSE U is currently under maintenance:</span>
		<span>Duration</span>
		<span>
			{moment(sysState.maintenance.start).format('MM/DD HH:mm')}
			~ {moment(sysState.maintenance.end).format('MM/DD HH:mm')}
		</span>
		<span>Time Remain</span>
		<span>{secToMin(sysState.maintaining)}</span>
	</Dialog>
{/if}
