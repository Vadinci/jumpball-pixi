import { Core } from "./core/Core";
import { App } from "./core/services/App";

const app = new App({
	width: 640,
	height: 1080,
	backgroundColor:0xaaaaaa
});

export const core = new Core({
	app
});