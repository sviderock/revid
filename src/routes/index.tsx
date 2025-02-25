import { createReconnectingWS, type ReconnectingWebSocket } from '@solid-primitives/websocket';
import { createFileRoute } from '@tanstack/solid-router';
import { For, onCleanup, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
import { encodeJson, getWsUrl, parseJson } from '~/lib/utils';
import QRCode from 'qrcode';
import type { WSServerEvent } from '../wsServer';
import type WAWebJS from 'whatsapp-web.js';
import { createStore } from 'solid-js/store';

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
	const [chats, setChats] = createStore<WAWebJS.Chat[]>([]);

	onMount(() => {
		if (!wsClient) return;

		wsClient.addEventListener('message', (event) => {
			const data = parseJson<WSServerEvent>(event.data);
			if (!data) return;

			switch (data.type) {
				case 'qrcode': {
					QRCode.toCanvas(canvasRef!, data.data);
					break;
				}

				case 'chats_list': {
					console.log(123);
					setChats(data.list);
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

			<div class="flex flex-col gap-2">
				<For each={chats}>
					{(chat) => <div class="flex border-2 border-zinc-600 p-4">{chat.name}</div>}
				</For>
			</div>
		</main>
	);
}
