import { Loader } from "@pixi/loaders";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { GameComponents } from "../Components";
import { PlatformFactory } from "../platforms/PlatformFactory";

export class PaddleSpawningSystem extends BaseSystem<GameComponents> {
	private _platformFactory: PlatformFactory;

	private _ticksTillSpawn: number = 45;

	constructor(world: World<GameComponents>, loader: Loader) {
		super(world);
		this._platformFactory = new PlatformFactory(world, loader)
	}

	public override tick(): void {
		if (this._ticksTillSpawn-- > 0) return;

		const platform = this._world.getNewEntity();
		this._platformFactory.buildNormal(platform);
		this._world.addComponent(platform, "position", { x: Math.floor(Math.random() * 320), y: -24 });

		this._ticksTillSpawn = 45;
	}
}