import { Filter } from "../Filter";
import { Entity } from "../Entity";
import { ComponentMap, World } from "../World";

export class InclusionFilter<T extends ComponentMap> extends Filter<T> {
	private _world: World<T>;
	private _components: (keyof T)[];

	constructor(world: World<T>, components: (keyof T)[]) {
		super();
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

	public getIncludedTypes(): (keyof T)[] {
		return this._components;
	}
}