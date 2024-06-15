import 'dotenv/config';
import type { CapacitorConfig } from '@capacitor/cli';

const { DEV_URL, USE_DEV_SERVER } = process.env;

const serverConfig =
	USE_DEV_SERVER === 'true'
		? {
				url: DEV_URL,
				cleartext: true,
				androidScheme: 'http',
				iosScheme: 'http'
			}
		: {
				androidScheme: 'https',
				iosScheme: 'https'
			};

const config: CapacitorConfig = {
	appId: 'art.twoenter.verseu.app',
	appName: 'Verse U',
	webDir: 'build',
	plugins: {
		App: {
			launchUrl: 'verseuapp://'
		}
	},
	server: serverConfig
};

export default config;
