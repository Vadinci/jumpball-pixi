import { Loader } from "@pixi/loaders";
import { World } from "../../ecs/World";
import { GameComponents } from "../Components";
import { PlatformFactory } from "../platforms/PlatformFactory";

export class PaddleSpawningSystem {
	private _world: World<GameComponents>;
	private _platformFactory: PlatformFactory;

	private _ticksTillSpawn: number = 45;

	constructor(world: World<GameComponents>, loader: Loader) {
		this._world = world;
		this._platformFactory = new PlatformFactory(world, loader)
	}

	public update(): void { }
	public tick(): void {
		if (this._ticksTillSpawn-- > 0) return;

		const platform = this._world.getEntity();
		this._platformFactory.buildNormal(platform);
		this._world.addComponent(platform, "position", { x: Math.floor(Math.random()*320), y: -24 });

		this._ticksTillSpawn = 45;
	}
}