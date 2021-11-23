import { Loader } from "@pixi/loaders";
import { BaseSystem, World } from "../BaseSystem";
import { PlatformFactory } from "../platforms/PlatformFactory";

export class PaddleSpawningSystem extends BaseSystem {
	private _platformFactory: PlatformFactory;

	private _ticksTillSpawn: number = 45;

	constructor(world: World, loader: Loader) {
		super(world);
		this._platformFactory = new PlatformFactory(world, loader)
	}

	public override tick(): void {
		if (this._ticksTillSpawn-- > 0) return;

		const platform = this._world.getEntity();
		this._platformFactory.buildNormal(platform);
		this._world.addComponent(platform, "position", { x: Math.floor(Math.random() * 320), y: -24 });

		this._ticksTillSpawn = 45;
	}
}