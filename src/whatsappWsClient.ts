import waw from 'whatsapp-web.js';
import { encodeEvent } from '~/lib/utils';
import type { WSServerEvent } from '~/wsServer';
const { Client, LocalAuth } = waw;

const client = new Client({
	authStrategy: new LocalAuth({ clientId: 'msv' }),
	puppeteer: { headless: true },
});

const ws = new WebSocket('ws://localhost:3001');

function wsSend<E extends WSServerEvent>(e: E) {
	ws.send(encodeEvent(e));
}

console.log('init ws WA client');
client.initialize();

client.on('loading_screen', (percent, message) => {
	console.log('LOADING SCREEN', percent, message);
});

client.on('authenticated', () => {
	console.log('AUTHENTICATED');
});

client.on('auth_failure', (msg) => {
	// Fired if session restore was unsuccessful
	console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
	console.log('Client was logged out', reason);
});

client.on('ready', async () => {
	console.log('Ready! 123');
	client.pupPage?.on('pageerror', function (err) {
		console.log('Page error: ' + err.toString());
	});
	client.pupPage?.on('error', function (err) {
		console.log('Page error: ' + err.toString());
	});

	wsSend({ type: 'whatsapp_ws_ready' });
});

client.on('qr', (qr) => {
	console.log('got qr code', qr);
	wsSend({ type: 'whatsapp_qrcode', data: qr });
});

client.on('message', async (msg) => {
	console.log('got message');
	// if (msg.hasMedia) {
	// 	const media = await msg.downloadMedia();
	// }
});
