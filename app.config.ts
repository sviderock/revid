import { defineConfig } from '@solidjs/start/config';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	middleware: './src/lib/middleware.ts',
	ssr: false,
	vite: {
		plugins: [tsconfigPaths(), TanStackRouterVite({ target: 'solid' })],
	},
});
