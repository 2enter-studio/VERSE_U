import { derived } from 'svelte/store';
import config from '@/config';
import { locale } from '@/stores';

const { UI_TEXTS } = config;
export const uiTexts = derived(locale, ($locale) => UI_TEXTS[$locale]);
