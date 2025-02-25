import { defineConfig } from '@solidjs/start/config';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	middleware: './src/lib/middleware.ts',
	ssr: false,
	server: {
		experimental: {
			websocket: true,
		},
	},
	vite: {
		plugins: [tsconfigPaths(), TanStackRouterVite({ target: 'solid' })],
	},
}).addRouter({
	name: '_ws',
	type: 'http',
	handler: './src/lib/wsServer.ts',
	target: 'server',
	base: '/_ws',
	plugins: () => [tsconfigPaths()],
});
