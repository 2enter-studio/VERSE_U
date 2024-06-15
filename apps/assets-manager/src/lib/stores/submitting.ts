import { writable } from 'svelte/store';

const submitting = writable<boolean>(false);

export { submitting };
