import { derived, writable } from 'svelte/store';
import { type TableName } from '@/config';

type EditInfo = { table: TableName; id: string };

const editHistory = writable<EditInfo[]>([]);
const editing = derived(editHistory, ($hist) => $hist.at(-1));

function setEditing(data: EditInfo) {
	editHistory.update((hist) => [...hist, data]);
}
function backEditing() {
	editHistory.update((hist) => hist.slice(0, -1));
}

export { editing, editHistory, setEditing, backEditing };

export type { EditInfo };
