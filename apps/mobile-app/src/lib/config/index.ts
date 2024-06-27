import * as UI_TEXTS from './ui_texts';

// const OAUTH_PROVIDERS = ['facebook', 'google', 'apple'] as const;
const OAUTH_PROVIDERS = [] as const;
const BUCKET_NAMES = ['meshes', 'regions', 'stickers', 'wearings', 'user_data'] as const;
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

type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];
type BucketName = (typeof BUCKET_NAMES)[number];
type CharacterAnimation = (typeof CHARACTER_ANIMATIONS)[number];

const DEFAULT_ROUTE = '/map';
const DEFAULT_LOCALE = 'zh';
const MAP_SIZE = 3200;
const FRAME_RATE = 12;
const DEFAULT_CAMERA_POS = [0, 2.0, 2.0] as const;
const ZOOM_IN_CAMERA_POS = [0, 2.3, 0.5] as const;
const SYS_MSG_LIFE_TIME = 5000;
const USE_SMOOTH_MAP_MOTION = false;

export {
	UI_TEXTS,
	OAUTH_PROVIDERS,
	BUCKET_NAMES,
	CHARACTER_ANIMATIONS,
	DEFAULT_ROUTE,
	DEFAULT_LOCALE,
	MAP_SIZE,
	FRAME_RATE,
	DEFAULT_CAMERA_POS,
	ZOOM_IN_CAMERA_POS,
	SYS_MSG_LIFE_TIME,
	USE_SMOOTH_MAP_MOTION
};

export type { OAuthProvider, BucketName, CharacterAnimation };
