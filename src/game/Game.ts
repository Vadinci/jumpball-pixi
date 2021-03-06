import { Container, DisplayObject } from "@pixi/display";
import { Loader } from "@pixi/loaders";
import { Sprite } from "@pixi/sprite";
import { core } from "../core";
import { World } from "../ecs/World";
import { gameComponents } from "./Components";
import { ISystem } from "./interfaces/ISystem";
import { DisplayObjectSystem } from "./systems/DisplayObjectSystem";
import { PaddleRemovalSystem } from "./systems/PaddleRemovalSystem";
import { PaddleSpawningSystem } from "./systems/PaddleSpawningSystem";
import { PlayerControllerSystem } from "./systems/PlayerControllerSystem";
import { PlayerMovementSystem } from "./systems/PlayerMovementSystem";
import { VelocitySystem } from "./systems/VelocitySystem";
export class Game {
	private _container: Container;

	constructor() {
		const app = core.services.app.app;

		this._container = new Container();
		app.stage.addChild(this._container);

		console.log("create world");
		let world = new World(gameComponents);
		
		let ePlayer = world.getNewEntity();
		world.addComponent(ePlayer, "position", { x: 160, y: 12 });

		let systems: ISystem[] = [
			new PaddleSpawningSystem(world),
			new PlayerControllerSystem(world, ePlayer),
			new PlayerMovementSystem(world, ePlayer),
			new VelocitySystem(world),
			new PaddleRemovalSystem(world),
			new DisplayObjectSystem(world, this._container)
		];

		// load assets
		const loading = core.services.resources.load([
			["paddle.png"],
			["player.png"]
		]);

		loading.complete.then(() => {
			const playerSprite = new Sprite(core.services.resources.getTexture("player"));
			playerSprite.anchor.set(0.5, 1);

			world.addComponent(ePlayer, "displayObject", { displayObject: playerSprite });
			
			world.addComponent(ePlayer, "velocity", { x: 0, y: -10 });
			world.addComponent(ePlayer, "player", {});


			//bottom paddle
			const floor = world.getNewEntity();
			world.addComponent(floor, "position", { x: 160, y: 540 });
			world.addComponent(floor, "topCollision", { width: 320 });

			app.ticker.add((dt: number) => {
				// @TODO separate update and tick loop (core service?)
				systems.forEach(system => system.tick());
				systems.forEach(system => system.update(dt));
			});

		});
	}
}