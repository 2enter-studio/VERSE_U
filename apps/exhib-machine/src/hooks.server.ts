import chalk from 'chalk';
import type { Handle } from '@sveltejs/kit';

import { initFileStorage } from '@/server/download';
import { initMetaData } from '@/server/metadata';
import { call101Player, callHaiAnPlayer } from '@/server/players/hai_an';
import { wsHandler } from '@/server/ws';
import { serverState } from '@/server/state';
import { HAI_AN_CALL_TIMEOUT } from '@/config';

async function serverInit() {
	console.log(chalk.yellowBright('Initializing server...'));
	initFileStorage();
	initMetaData();
	setInterval(async () => {
		await callHaiAnPlayer();
		await call101Player();
	}, HAI_AN_CALL_TIMEOUT);

	serverState.initialized = true;
	console.log(chalk.yellowBright('Server initialized!'));
}

const handle: Handle = async ({ event, resolve }) => {
	if (!serverState.initialized) {
		await serverInit();
	}

	return resolve(event);
};

const handleWebsocket = wsHandler;

export { handle, handleWebsocket };
