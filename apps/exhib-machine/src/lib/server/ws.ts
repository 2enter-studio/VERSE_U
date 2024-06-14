import type { ServerWebSocket, WebSocketHandler } from 'svelte-adapter-bun';
import chalk from 'chalk';

let wsClients = new Set<ServerWebSocket>();

const wsHandler: WebSocketHandler = {
	open(ws) {
		wsClients.add(ws);
		broadcastMessage('we got a new client');
	},
	message(ws, message) {
		console.log(message);
	},
	close: (ws) => {
		broadcastMessage('we lost a client');
		wsClients.delete(ws);
	},
	upgrade(request, upgrade: Function) {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/ws')) {
			return upgrade(request);
		}
		return false;
	}
};

function broadcastMessage(message: string) {
	for (let client of getWebSocketClients()) {
		client.send(message);
	}
	console.log(chalk.cyan(`broadcast message: ${JSON.stringify(message, null, 2)}`));
}

function getWebSocketClients() {
	return wsClients;
}

export { wsHandler, broadcastMessage, getWebSocketClients };
