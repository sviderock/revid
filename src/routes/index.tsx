import { createReconnectingWS, type ReconnectingWebSocket } from '@solid-primitives/websocket';
import { createFileRoute } from '@tanstack/solid-router';
import { onCleanup, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
import { encodeJson, getWsUrl, parseJson } from '~/lib/utils';
import QRCode from 'qrcode';

export let wsClient: ReconnectingWebSocket | null;

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

export function sendWS<T extends object>(event: T) {
	wsClient?.send(encodeJson(event));
}

function RouteComponent() {
	let canvasRef: HTMLCanvasElement;
	wsClient = isServer ? null : createReconnectingWS(getWsUrl(location));

	onMount(() => {
		if (!wsClient) return;

		wsClient.addEventListener('message', (event) => {
			const data = parseJson(event.data);

			switch (data.type) {
				case 'qrcode': {
					QRCode.toCanvas(canvasRef!, data.data);
					break;
				}
			}
		});

		wsClient.addEventListener('open', (event) => {});
		wsClient.addEventListener('close', (event) => {});
		wsClient.addEventListener('error', (error) => {});

		// Clean up when the component unmounts
		onCleanup(() => {
			wsClient?.close();
		});
	});

	return (
		<main>
			<canvas ref={canvasRef!} />
		</main>
	);
}
