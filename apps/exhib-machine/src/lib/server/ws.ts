import type { ServerWebSocket, WebSocketHandler } from 'svelte-adapter-bun';
import chalk from 'chalk';

const clients = new Set<ServerWebSocket>();

const wsHandler: WebSocketHandler = {
	open(ws) {
		clients.add(ws);
		broadcastMessage({ message: 'we got a new client' });
	},
	message(ws, message) {
		console.log('received message', message);
	},
	close(ws) {
		clients.delete(ws);
		broadcastMessage({ message: 'we lost a client' });
	},
	upgrade(request, upgrade: Function) {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/ws')) {
			return upgrade(request);
		}
		return false;
	}
};

function broadcastMessage(message: Record<string, any>) {
	for (let client of clients) {
		client.send(JSON.stringify(message));
	}
	console.log(chalk.cyan('broadcast message'), message);
}

export { wsHandler, broadcastMessage };
