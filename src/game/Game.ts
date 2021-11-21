import { Filter } from "@pixi/core";
import { Container } from "@pixi/display";
import { Loader } from "@pixi/loaders";
import { Sprite } from "@pixi/sprite";
import { core } from "../core";
import { World } from "../ecs/World";
import { gameComponents } from "./Components";
import { DisplayObjectSystem } from "./systems/DisplayObjectSystem";
import { PlatformSpawningSystem } from "./systems/PlatformSpawningSystem";
import { VelocitySystem } from "./systems/VelocitySystem";
export class Game {

	private _container: Container;

	constructor() {
		const app = core.services.app.app;
		const loader: Loader = new Loader("./assets/");

		this._container = new Container();
		app.stage.addChild(this._container);

		console.log("create world");
		let world = new World(gameComponents);
		let ePlayer = world.getEntity();

		console.log("add position to entity");
		world.addComponent(ePlayer, "position", { x: 0, y: 12 });

		let doSystem = new DisplayObjectSystem(world, this._container);
		let psSystem = new PlatformSpawningSystem(world, loader);
		let vSystem = new VelocitySystem(world);

		app.ticker.add((dt: number) => {
			psSystem.update();
			psSystem.tick();

			doSystem.update();
			doSystem.tick();

			vSystem.update();
			vSystem.tick();

			const oldPosition = world.getComponent(ePlayer,"position");
			world.addComponent(ePlayer, "position", {x: oldPosition.x + 0.5, y : oldPosition.y + 0.5});
		});


		// load assets
		loader.add("paddle", "paddle.png");
		loader.add("player", "player.png");
		loader.onComplete.add(loader => {
			const playerSprite = new Sprite(loader.resources["player"].texture);

			world.addComponent(ePlayer, "displayObject", { displayObject: playerSprite });

		});
		loader.load();
	}
}