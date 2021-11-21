import { Entity } from "./Entity";
import { ComponentMap, World } from "./World";

export class Filter<Q extends ComponentMap, T extends (keyof Q)[]> {
	private _world: World<Q>;
	private _components: [...T];

	constructor(world: World<Q>, components: [...T]) {
		this._world = world;
		this._components = components;
	}

	public isApproved(entity: Entity): boolean {
		for (let ii = 0; ii < this._components.length; ii++) {
			if (!this._world.hasComponent(entity, this._components[ii])) {
				return false;
			}
		}
		return true;
	}

	public getIncludedTypes(): T {
		return this._components;
	}
}