const errorKeys = [
	'ERROR_UNKNOWN',
	'ERROR_INVALID_EMAIL',
	'ERROR_INVALID_PASSWORD',
	'ERROR_INVALID_UUID',
	'ERROR_CANNOT_LOAD_REGIONS',
	'ERROR_CANNOT_LOAD_WEARINGS'
] as const;

const keys = [
	'version',
	'locale',
	'language',
	'error',
	'settings',
	'friends',
	'strangers',
	'people_nearby',
	'profile',
	'system',
	'email',
	'name',
	'signin',
	'signout',
	'signup',
	'password',
	'confirm_password',
	'new_password',
	'forgot_pwd',
	'change_pwd',
	'welcome',
	'where_are_you_going'
	// ...errorKeys
] as const;

export type ErrorUITextTable = Record<(typeof errorKeys)[number], string>;
export type UITextTable = Record<(typeof keys)[number], string>;
