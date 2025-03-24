import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: false,
	},
	define: {
		__APP_VERSION__: JSON.stringify(version),
	},
	optimizeDeps: {
		exclude: ["@speed-highlight/core", "@svgdotjs/svg.js", "fuse.js"],
		include: ["element-resize-detector"],
	},
	configureWebpack: {
		module: {
			rules: [
				{
					test: /\.mdx?$/,
					use: ["babel-loader", "@mdx-js/vue-loader"],
				},
			],
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@operational.co/styles/_globals.scss";`,
				quietDeps: true,
			},
		},
	},
	plugins: [
		vue(),
		mdx({
			jsxImportSource: "vue",
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
		}),
		VitePWA({
			injectRegister: false,
			registerType: "autoUpdate",
			workbox: {
				cleanupOutdatedCaches: true,
				skipWaiting: true,
				clientsClaim: true,
			},
			includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
			manifest: {
				name: "Operational.co",
				short_name: "Operational.co",
				description: "All your operational issues at a glance",
				theme_color: "#000000",
				icons: [
					{
						src: "favicons/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "favicons/android-chrome-192x192.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // map '@' to './src'
		},
	},

	server: {
		port: 8080,
	},
});
