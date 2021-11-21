
import { Texture } from "@pixi/core";
import { Entity } from "./Entity";
import { Filter } from "./Filter";
import { ComponentMap, World } from "./World";

export class Family<Q extends ComponentMap, T extends (keyof Q)[]> {

	private _filter: Filter<Q, T>;
	private _world: World<Q>;

	constructor(world: World<Q>, filter: Filter<Q, T>) {
		this._filter = filter;
		this._world = world;
	}

	/*public forEach(callback: (entity: Entity, components: {[key in keyof T]: Q[T]}) => void) {

	}*/

	public getComponents(entity: Entity) { //({ [K in keyof T]: Q[K] }) {
		let foo: { [key in keyof Q]?: Q[key] } = {};

		this._filter.getIncludedTypes().forEach(type => {
			foo[type] = this._world.getComponent(entity, type);
		})

		let foo2 = foo as { [key in Extract<keyof Q, T[number]>]: Q[key]}
		return foo2;
	}
}