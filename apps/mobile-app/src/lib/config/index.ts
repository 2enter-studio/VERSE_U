import UI_TEXTS from './ui_texts';

const LOCALES = ['en', 'zh'] as const;
// const OAUTH_PROVIDERS = ['facebook', 'google', 'apple'] as const;
const OAUTH_PROVIDERS = [] as const;
const BUCKETS = ['meshes', 'regions', 'stickers', 'wearings', 'user_data'] as const;
const CHARACTER_ANIMATIONS = [
	'chicken_dance',
	'idle',
	'idle_breathe',
	'idle_feminine',
	'idle_happy',
	'run_and_jump',
	'tut_Dance',
	'YMCA_dance',
	'Macarena_Dance'
] as const;

export type Locale = (typeof LOCALES)[number];
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];
export type Bucket = (typeof BUCKETS)[number];
export type CharacterAnimation = (typeof CHARACTER_ANIMATIONS)[number];

export default {
	UI_TEXTS,
	LOCALES,
	OAUTH_PROVIDERS,
	BUCKETS,
	CHARACTER_ANIMATIONS,
	DEFAULT_ROUTE: '/me',
	MIN_STAY_TIME: 1000 * 3,
	MAX_STAY_TIME: 1000 * 60 * 60 * 8,
	MAP_SIZE: 3200,
	FRAME_RATE: 12,
	DEFAULT_CAMERA_POS: [0, 2.0, 2.0],
	ZOOM_IN_CAMERA_POS: [0, 2.3, 0.5]
} as const;
