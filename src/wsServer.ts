import Bun from 'bun';
import type WAWebJS from 'whatsapp-web.js';
import { encodeEvent, parseJson } from '~/lib/utils';

const WS_CHAT_ID = 'group-chat';

export type WSServerEvent =
	| { type: 'whatsapp_ws_ready' }
	| { type: 'whatsapp_qrcode'; data: string }
	| { type: 'qrcode'; data: string }
	| { type: 'chats_list'; list: WAWebJS.Chat[] };

const server = Bun.serve({
	port: 3001,
	fetch(req, server) {
		// upgrade the request to a WebSocket
		if (server.upgrade(req)) {
			return; // do not return a Response
		}
		return new Response('Upgrade failed', { status: 500 });
	},
	websocket: {
		async open(peer) {
			peer.subscribe(WS_CHAT_ID);
			try {
				console.log('open');
			} catch (error) {
				console.log(error);
			}
		},
		async message(peer, msg) {
			console.log(123);
			const event = parseJson<WSServerEvent>(msg as string);
			if (!event) return;

			switch (event.type) {
				case 'whatsapp_ws_ready': {
					console.log('YEBAT');
					break;
				}

				case 'whatsapp_qrcode': {
					console.log('got qr code from whatsapp, broadcasting...');
					server.publish(WS_CHAT_ID, encodeEvent({ type: 'qrcode', data: event.data }));
					break;
				}

				default:
					break;
			}
		},
		async close(peer, details) {
			console.log('close');
			peer.unsubscribe(WS_CHAT_ID);
		},
	},
});
