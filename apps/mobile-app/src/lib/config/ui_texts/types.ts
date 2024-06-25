const TEXT_CODES = [
	'VERSION',
	'LOCALE',
	'LANGUAGE',
	'ERROR',
	'WARNING',
	'SUCCESS',
	'SETTINGS',
	'FRIENDS',
	'STRANGERS',
	'PEOPLE_NEARBY',
	'PROFILE',
	'SYSTEM',
	'EMAIL',
	'NAME',
	'SIGNIN',
	'SIGNOUT',
	'SIGNUP',
	'PASSWORD',
	'CONFIRM_EXECUTION',
	'CONFIRM_PASSWORD',
	'NEW_PASSWORD',
	'FORGOT_PWD',
	'CHANGE_PWD',
	'WELCOME',
	'WHERE_ARE_YOU_GOING',
	'UNKNOWN_ERROR',
	'INVALID_DATA_INPUT',
	'FAILED_TO_LOAD_DATA'
] as const;

type TextCode = (typeof TEXT_CODES)[number];
type UITextTable = Record<TextCode, string>;

export type { TextCode, UITextTable };
