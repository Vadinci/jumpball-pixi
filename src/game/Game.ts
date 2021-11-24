import { Container, DisplayObject } from "@pixi/display";
import { Loader } from "@pixi/loaders";
import { Sprite } from "@pixi/sprite";
import { core } from "../core";
import { World } from "../ecs/World";
import { gameComponents } from "./Components";
import { ISystem } from "./interfaces/ISystem";
import { CollisionSystem } from "./systems/CollisionSystem";
import { DisplayObjectSystem } from "./systems/DisplayObjectSystem";
import { GravitySystem } from "./systems/GravitySystem";
import { PaddleRemovalSystem } from "./systems/PaddleRemovalSystem";
import { PaddleSpawningSystem } from "./systems/PaddleSpawningSystem";
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
		let ePlayer = world.getNewEntity();

		console.log("add position to entity");

		let systems: ISystem[] = [
			new PaddleSpawningSystem(world, loader),
			new DisplayObjectSystem(world, this._container),
			new VelocitySystem(world),
			new GravitySystem(world),
			new CollisionSystem(world),
			new PaddleRemovalSystem(world)
		]

		app.ticker.add((dt: number) => {
			// @TODO separate update and tick loop (core service?)
			systems.forEach(system => system.tick());
			systems.forEach(system => system.update(dt));
		});


		// load assets
		loader.add("paddle", "paddle.png");
		loader.add("player", "player.png");
		loader.onComplete.add(loader => {
			const playerSprite = new Sprite(loader.resources["player"].texture);
			playerSprite.anchor.set(0.5, 1);

			world.addComponent(ePlayer, "displayObject", { displayObject: playerSprite });
			world.addComponent(ePlayer, "position", { x: 160, y: 12 });
			world.addComponent(ePlayer, "velocity", { x: 0, y: -10 });
			world.addComponent(ePlayer, "gravity", {});
			world.addComponent(ePlayer, "player", {});


			//bottom paddle
			const floor = world.getNewEntity();
			world.addComponent(floor, "position", { x: 160, y: 540 });
			world.addComponent(floor, "topCollision", { width: 320 });

		});
		loader.load();
	}
}