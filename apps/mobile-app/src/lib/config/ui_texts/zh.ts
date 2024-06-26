import type { UITextTable } from '@/config/ui_texts/types';

const table: UITextTable = {
	ACCOUNT: '帳戶',
	VERSION: '版本',
	LOCALE: '繁體中文',
	LANGUAGE: '語言',
	ERROR: '錯誤',
	WARNING: '警告',
	SUCCESS: '成功',
	SETTINGS: '設定',
	FRIENDS: '好友',
	STRANGERS: '過客',
	PEOPLE_NEARBY: '附近的人',
	PROFILE: '個人資料',
	SYSTEM: '系統',
	EMAIL: 'E-mail',
	NAME: '名稱',
	SIGNIN: '登入',
	SIGNOUT: '登出',
	SIGNUP: '註冊',
	PASSWORD: '密碼',
	CONFIRM_EXECUTION: '確定執行',
	CONFIRM_PASSWORD: '確認密碼',
	NEW_PASSWORD: '新密碼',
	FORGOT_PWD: '忘記密碼',
	CHANGE_PWD: '更改密碼',
	WELCOME: '歡迎來到 Verse U',
	WHERE_ARE_YOU_GOING: '去哪裡?',
	UNKNOWN_ERROR: '',
	INVALID_DATA_INPUT: '',
	FAILED_TO_LOAD_DATA: ''
} as const;

export { table as zh };
