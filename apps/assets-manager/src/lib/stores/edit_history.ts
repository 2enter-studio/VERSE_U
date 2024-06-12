import { derived, writable } from 'svelte/store';

const editHistory = writable<string[]>([]);
const editing = derived(editHistory, ($hist) => $hist.at(-1));

function setEditing(id: string) {
	editHistory.update((hist) => [...hist, id]);
}
function backEditing() {
	editHistory.update((hist) => hist.slice(0, -1));
}

export { editing, editHistory, setEditing, backEditing };
