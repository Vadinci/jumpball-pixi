
import { Texture } from "@pixi/core";
import { Entity } from "./Entity";
import { Filter } from "./Filter";
import { ComponentMap, World } from "./World";

type FamilyComponents<Q extends ComponentMap, T extends keyof Q> = { [key in Extract<keyof Q, T>]: ReturnType<Q[key]["getEntityData"]> };
export class Family<Q extends ComponentMap, T extends keyof Q> {

	private _filter: Filter<Q, T>;
	private _world: World<Q>;

	constructor(world: World<Q>, filter: Filter<Q, T>) {
		this._filter = filter;
		this._world = world;
	}

	public getComponents(entity: Entity): FamilyComponents<Q, T> {
		// @TODO hacky typing going on here
		let components: any = {};

		this._filter.getIncludedTypes().forEach(type => {
			components[type] = this._world.getComponent(entity, type);
		})

		return components as FamilyComponents<Q, T>
	}
}