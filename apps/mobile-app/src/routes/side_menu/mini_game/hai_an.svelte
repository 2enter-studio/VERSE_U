<script lang="ts">
	import { Form, SubmitBtn } from '@/components';
	import { triggerHaiAn } from '@/utils';
</script>

<Form submitFunction={triggerHaiAn}>
	<input type="text" name="passcode" />
	<SubmitBtn>Go</SubmitBtn>
</Form>
