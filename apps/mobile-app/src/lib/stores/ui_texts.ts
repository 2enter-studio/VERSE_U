import { derived } from 'svelte/store';
import { UI_TEXTS } from '@/config';
import { locale } from '@/stores';

export const uiTexts = derived(locale, ($locale) => UI_TEXTS[$locale]);
