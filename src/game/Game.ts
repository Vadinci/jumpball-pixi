import { Graphics } from "@pixi/graphics";
import { core } from "../core";

export class Game {
	constructor(){
		const app = core.services.app.app;
		const background = new Graphics();
		background.beginFill(0xff0000).drawRect(0, 0, 50, 50);//.endFill();
		console.log(background);
		app.stage.addChild(background)
	}
}