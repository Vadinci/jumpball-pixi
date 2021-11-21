import { Filter } from "../Filter";
import { Entity } from "../Entity";
import { ComponentMap, World } from "../World";

export class ExclusionFilter<Q extends ComponentMap> extends Filter<Q, ""> {
	private _world: World<Q>;
	private _components: (keyof Q)[];

	constructor(world: World<Q>, components: (keyof Q)[]) {
		super();
		this._world = world;
		this._components = components;
	}

	public isApproved(entity: Entity): boolean {
		for (let ii = 0; ii < this._components.length; ii++) {
			if (this._world.hasComponent(entity, this._components[ii])) {
				return false;
			}
		}
		return true;
	}

	public getIncludedTypes(): [] {
		return [];
	}
}