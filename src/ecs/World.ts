import { Component } from "./Component";
import { Entity } from "./Entity";
import { Family } from "./Family";
import { Filter } from "./Filter";
import { AggregateFilter } from "./filters/AggregateFilter";
import { ExclusionFilter } from "./filters/ExclusionFilter";
import { InclusionFilter } from "./filters/InclusionFilter";

export type ComponentMap = { [key: string]: Component<any> };
type ComponentKey<T extends ComponentMap> = keyof T;
// @TODO can we infer the data type some other way, instead of 'abusing' getEntityData?
type DataType<T extends ComponentMap, Q extends ComponentKey<T>> = ReturnType<T[Q]["getEntityData"]>;

export class World<T extends ComponentMap> {

	private _components: T;

	private _nextId: number = 0;
	private _entityPool: Entity[] = [];	// @TODO make proper pool

	public constructor(components: T) {
		this._components = components;
	}

	public getEntity(): Entity {
		const entity: Entity = { id: this._nextId++ };
		this._entityPool.push(entity);
		return entity;
	}

	// @TODO can we make componentKey optional? Since Q should always be a string anyway?
	public addComponent<Q extends ComponentKey<T>>(entity: Entity, componentKey: Q, data: DataType<T, Q>): void {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		component.addToEntity(entity, data);
	}

	public getComponent<Q extends ComponentKey<T>>(entity: Entity, componentKey: Q): DataType<T, Q> {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		return component.getEntityData(entity);
	}

	public removeComponent<Q extends ComponentKey<T>>(entity: Entity, componentKey: Q): void {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		return component.removeFromEntity(entity);
	}

	public hasComponent<Q extends ComponentKey<T>>(entity: Entity, componentKey: Q): boolean {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		return component.isOnEntity(entity);
	}
}

type GameComponents = {
	"foo": Component<{ x: number, y: number }>,
	"bar": Component<{ alias: string }>,
};

type GameComponents2 = {
	"qux": Component<{ x: number, y: number }>,
};

const components: GameComponents = {
	"foo": new Component<{ x: number, y: number }>(),
	"bar": new Component<{ alias: string }>(),
}

const components2: GameComponents2 = {
	"qux": new Component<{ x: number, y: number }>()
}

const dummyWorld = new World(components);
const dummyWorld2 = new World(components2);

const e = dummyWorld.getEntity();
dummyWorld.addComponent(e, "foo", { x: 10, y: 12 });
console.log(dummyWorld.getComponent(e, "foo"));
// dummyWorld.addComponent(e, "foo", { x: 10, y: 12 });

const testFilter = new InclusionFilter(dummyWorld, ["foo"]);
const testFilter2 = new InclusionFilter(dummyWorld, ["bar"]);
const testFilter3 = new InclusionFilter(dummyWorld2, ["qux"]);
const testFilter4 = new ExclusionFilter(dummyWorld, ["bar"]);
const aggFilter = new AggregateFilter([testFilter, testFilter4]);

const testFamily = new Family(dummyWorld, aggFilter);
let comps = testFamily.getComponents(e);

