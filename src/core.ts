import { SCALE_MODES } from "@pixi/constants";
import { settings } from "@pixi/settings";
import { Core } from "./core/Core";
import { AppService } from "./core/services/App";
import { ResourceService } from "./core/services/Resources";

const app = new AppService({
	width: 320,
	height: 560,
	antialias: false,
	//resizeTo: window,
	resolution: 2,
	backgroundColor:0x222034
});

settings.SCALE_MODE = SCALE_MODES.NEAREST;

export const core = new Core({
	app,
	resources: new ResourceService("./assets/")
});