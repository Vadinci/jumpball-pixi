import { Event, IListenableEvent } from "../core/classes/Event";
import { Entity } from "./Entity";
import { Filter } from "./Filter";
import { ComponentMap, World } from "./World";

export type FamilyComponents<Q extends ComponentMap, T extends keyof Q> = { [key in Extract<keyof Q, T>]: ReturnType<Q[key]["getEntityData"]> };
export type FamilyCallback<Q extends ComponentMap, T extends keyof Q> = (entity: Entity, components: FamilyComponents<Q, T>) => void;

export class Family<Q extends ComponentMap, T extends keyof Q> {
	private _filter: Filter<Q, T>;
	private _world: World<Q>;

	private _entities: Entity[] = [];
	private readonly _components: T[];

	private _onEntityAdded: Event<[entity: Entity, components: FamilyComponents<Q, T>]> = new Event();
	public get onEntityAdded(): IListenableEvent<[entity: Entity, components: FamilyComponents<Q, T>]> {
		return this._onEntityAdded;
	}

	private _onEntityRemoved: Event<[entity: Entity, components: FamilyComponents<Q, T>]> = new Event();
	public get onEntityRemoved(): IListenableEvent<[entity: Entity, components: FamilyComponents<Q, T>]> {
		return this._onEntityRemoved;
	}

	constructor(world: World<Q>, filter: Filter<Q, T>) {
		this._filter = filter;
		this._world = world;

		this._components = this._filter.getIncludedTypes();

		this._world.onComponentAdded.listen(this._evaluateEntity, this);
		this._world.onComponentRemoved.listen(this._evaluateEntity, this);
	}

	public forEach(callBack: FamilyCallback<Q, T>): void {
		for (let ii = this._entities.length - 1; ii >= 0; ii--) {
			const entity = this._entities[ii];
			const components = this._getComponents(entity);
			callBack(entity, components);
		}
	}

	private _getComponents(entity: Entity): FamilyComponents<Q, T> {
		// @TODO hacky typing going on here
		let componentData: any = {};

		this._components.forEach(type => {
			componentData[type] = this._world.getComponent(entity, type);
		})

		return componentData as FamilyComponents<Q, T>
	}

	private _evaluateEntity(entity: Entity): void {
		const idx: number = this._entities.indexOf(entity);
		if (this._filter.isApproved(entity)) {
			if (idx === -1) {
				this._entities.push(entity);
				this._onEntityAdded.fire(entity, this._getComponents(entity));
			}
		} else {
			if (idx !== -1) {
				this._entities.splice(idx, 1);
				this._onEntityRemoved.fire(entity, this._getComponents(entity));
			}
		}
	}
}