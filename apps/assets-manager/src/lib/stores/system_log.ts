import { writable } from 'svelte/store';

type SystemLogType = 'success' | 'warning' | 'error';
type SystemLog = {
	type: SystemLogType;
	created_at: number;
	message: string;
	detail?: string;
};

const systemLogs = writable<SystemLog[]>([]);

function setSystemLog(type: SystemLogType, message: string, detail?: string) {
	systemLogs.update((notification) => [
		...notification,
		{
			type,
			created_at: Date.now(),
			message,
			detail
		}
	]);
}

function deleteNotification(created_at: number) {
	systemLogs.update((notification) => notification.filter((n) => n.created_at !== created_at));
}

export { systemLogs, setSystemLog, deleteNotification };
