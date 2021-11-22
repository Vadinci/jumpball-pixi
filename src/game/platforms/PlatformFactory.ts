import { Loader } from "@pixi/loaders";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { Entity } from "../../ecs/Entity";
import { World } from "../../ecs/World";
import { GameComponents } from "../Components";
import { Game } from "../Game";
export class PlatformFactory {
	private _world: World<GameComponents>;
	private _resources: Loader;

	constructor(world: World<GameComponents>, resources: Loader) {
		this._world = world;
		this._resources = resources;	// @TODO
	}

	public buildNormal(e: Entity) {
		this._addDefaults(e);

		// add sprite
		const sprite = new NineSlicePlane(this._resources.resources["paddle"].texture!, 8, 4, 8, 4);	// @TODO
		sprite.width = 64; //@TODO
		sprite.pivot.set(sprite.width / 2, 0);

		this._world.addComponent(e, "displayObject", { displayObject: sprite });
		this._world.addComponent(e, "velocity", { x: 0, y: 1 });
		this._world.addComponent(e, "topCollision", { width: 64 });	// @TODO
	}

	private _addDefaults(e: Entity) {

	}
}