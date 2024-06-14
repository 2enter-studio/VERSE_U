import { wsHandler } from './src/lib/server/ws';

const port = Bun.env.PORT || 3000;

// and start this server
const server = Bun.serve({
	port,
	fetch(req, server) {
		// upgrade the request to a WebSocket
		const ok = wsHandler.upgrade(req, server.upgrade.bind(server));

		if (ok) return;

		return new Response('Upgrade failed :(', { status: 500 });
	},
	websocket: wsHandler as any
});

console.log(`Helper Bun server listening on ${server.hostname + ':' + server.port}`);
