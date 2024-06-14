import type { MetaData } from '@/config';
import { writable } from 'svelte/store';

const metadata = writable<MetaData | null>();

// export { metadata };
