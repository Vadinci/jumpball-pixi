import { Event, IListenableEvent } from "../core/classes/Event";
import { Component } from "./Component";
import { Entity } from "./Entity";

export type ComponentMap = { [key: string]: Component<any> };
// @TODO can we infer the data type some other way, instead of 'abusing' getEntityData?
type DataType<T extends ComponentMap, Q extends keyof T> = ReturnType<T[Q]["getEntityData"]>;
export class World<T extends ComponentMap> {
	private _components: T;

	private _nextId: number = 0;
	private _entityPool: Entity[] = [];
	private _freedEntities: Entity[] = [];

	private _onComponentAdded: Event<[entity: Entity, componentKey: keyof T]> = new Event();
	public get onComponentAdded(): IListenableEvent<[entity: Entity, componentKey: keyof T]> {
		return this._onComponentAdded;
	}

	private _onComponentRemoved: Event<[entity: Entity, componentKey: keyof T]> = new Event();
	public get onComponentRemoved(): IListenableEvent<[entity: Entity, componentKey: keyof T]> {
		return this._onComponentRemoved;
	}

	private _onEntityFreed: Event<[entity: Entity]> = new Event();
	public get onEntityFreed(): IListenableEvent<[entity: Entity]> {
		return this._onEntityFreed;
	}

	public constructor(components: T) {
		this._components = components;
	}

	public getEntity(): Entity {
		console.log("entity count: " + (this._nextId + 1));
		if (this._freedEntities.length > 0) {
			return this._freedEntities.pop()!;
		}

		const entity: Entity = { id: this._nextId++ };
		this._entityPool.push(entity);
		return entity;
	}

	public freeEntity(entity: Entity): void {
		Object.values(this._components).forEach(component => component.removeFromEntity(entity));
		this._entityPool.splice(this._entityPool.indexOf(entity), 1);
		this._freedEntities.push(entity);

		this._onEntityFreed.fire(entity);
	}

	// @TODO can we make componentKey optional? Since Q should always be a string anyway?
	public addComponent<Q extends keyof T>(entity: Entity, componentKey: Q, data: DataType<T, Q>): void {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		component.addToEntity(entity, data);

		this._onComponentAdded.fire(entity, componentKey);
	}

	public getComponent<Q extends keyof T>(entity: Entity, componentKey: Q): DataType<T, Q> {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		return component.getEntityData(entity);
	}

	public removeComponent<Q extends keyof T>(entity: Entity, componentKey: Q): void {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		component.removeFromEntity(entity);

		this._onComponentRemoved.fire(entity, componentKey);
	}

	public hasComponent<Q extends keyof T>(entity: Entity, componentKey: Q): boolean {
		const component: Component<DataType<T, Q>> = this._components[componentKey];
		return component.isOnEntity(entity);
	}
}