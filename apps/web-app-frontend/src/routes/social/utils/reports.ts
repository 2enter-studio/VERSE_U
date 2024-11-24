import validator from 'validator';
import { handleEFResponse } from '@/utils';
// import { db } from '@/db';

async function reportMessage(args: { message_id: string; reason: string }) {
	const { message_id, reason } = args;
	if (!validator.isUUID(message_id)) return;

	// const { data, error } = await db.functions.invoke('report-message', {
	// 	body: JSON.stringify(args)
	// });

	// await handleEFResponse(error, () => {
	// 	console.error(error);
	// 	// const newStatus = get(tripStatus);
	// });
	// console.log(data);
}

export { reportMessage };
