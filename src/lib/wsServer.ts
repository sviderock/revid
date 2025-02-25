import { eventHandler } from 'vinxi/http';
import WAClient from '~/lib/WAClient';

export default eventHandler({
	handler() {},
	websocket: {
		async open(peer) {
			console.log('ready');
			WAClient.on('ready', () => {
				console.log('Client is ready!');
			});

			WAClient.on('qr', (qr) => {
				console.log('got qr code', qr);
			});

			WAClient.on('message', async (msg) => {
				console.log('got message');
				console.log(msg);
				// if (msg.hasMedia) {
				// 	const media = await msg.downloadMedia();
				// 	// do something with the media data here
				// }
			});
		},
		async message(peer, msg) {},
		async close(peer, details) {},
		async error(peer, error) {},
	},
});
