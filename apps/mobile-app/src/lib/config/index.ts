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
const ROUTES = ['me', 'map', 'social', 'maintain', 'update', 'create_profile', 'account'] as const;

type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];
type BucketName = (typeof BUCKET_NAMES)[number];
type CharacterAnimation = (typeof CHARACTER_ANIMATIONS)[number];
type Route = (typeof ROUTES)[number];

const DEFAULT_ROUTE = 'me';
const DEFAULT_LOCALE = 'zh';
const MAP_SIZE = 3200;
const FRAME_RATE = 12;
const DEFAULT_CAMERA_POS = [0.05, 1.65, 2.0] as const;
const EXPRESSION_CAMERA_POS = [-0.1, 2.25, 0.4] as const;
const SELFIE_CAMERA_POS = [0, 2.25, 0.55] as const;
const DRESSROOM_CAMERA_POS = [-0.41, 1.65, 2.0] as const;
const SYS_MSG_LIFE_TIME = 3000;
const USE_SMOOTH_MAP_MOTION = false;
const APP_STORE_LINK = 'https://apps.apple.com/tw/app/verse-u/id6502902450';

export {
	UI_TEXTS,
	OAUTH_PROVIDERS,
	BUCKET_NAMES,
	CHARACTER_ANIMATIONS,
	DEFAULT_ROUTE,
	DEFAULT_LOCALE,
	MAP_SIZE,
	APP_STORE_LINK,
	FRAME_RATE,
	DEFAULT_CAMERA_POS,
	EXPRESSION_CAMERA_POS,
	SELFIE_CAMERA_POS,
	DRESSROOM_CAMERA_POS,
	SYS_MSG_LIFE_TIME,
	USE_SMOOTH_MAP_MOTION,
	ROUTES
};

export type { OAuthProvider, BucketName, CharacterAnimation, Route };
