import { writable } from 'svelte/store';

type NotificationType = 'success' | 'warning' | 'error';
type Notification = {
	type: NotificationType;
	created_at: number;
	message: string;
	detail?: string;
};

const notifications = writable<Notification[]>([
	{
		created_at: Date.now(),
		type: 'success',
		message: 'fuck you',
		detail: 'fuck you fuck you!'
	}
]);

function setNotification(type: NotificationType, message: string, detail?: string) {
	notifications.update((notification) => [
		...notification,
		{
			type,
			created_at: Date.now(),
			message,
			detail
		}
	]);
}

export { notifications, setNotification };