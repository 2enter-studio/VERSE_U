const SystemConfig = {
	one_o_one: {
		anonymous_login: true,
		email_login: false,
		use_captcha: true,
		setLocale: true,
		direct_after_login: {
			path: '/one-o-one',
		},
	},
	normal: {
		anonymous_login: false,
		email_login: true,
		use_captcha: false,
		setLocale: false,
		direct_after_login: {
			path: '/',
		},
	},
};

const ConfigSetting = {
	NORMAL: 'normal',
	ONE_O_ONE: 'one_o_one',
} as const;

const CurrentConfigSetting = ConfigSetting.ONE_O_ONE;

const CurrentSystemConfig = SystemConfig[CurrentConfigSetting];

export { CurrentSystemConfig, ConfigSetting, CurrentConfigSetting };
