import { Event, IListenableEvent } from "../core/classes/Event";
import { Entity } from "./Entity";
import { Filter } from "./Filter";
import { ComponentMap, World } from "./World";
export class Family<T extends ComponentMap> {
	private _filter: Filter<T>;
	private _world: World<T>;

	private _entities: Entity[] = [];
	private readonly _components: (keyof T)[];

	private _onEntityAdded: Event<[entity: Entity]> = new Event();
	public get onEntityAdded(): IListenableEvent<[entity: Entity]> {
		return this._onEntityAdded;
	}

	private _onEntityRemoved: Event<[entity: Entity]> = new Event();
	public get onEntityRemoved(): IListenableEvent<[entity: Entity]> {
		return this._onEntityRemoved;
	}

	constructor(world: World<T>, filter: Filter<T>) {
		this._filter = filter;
		this._world = world;

		this._components = this._filter.getIncludedTypes();

		this._world.onComponentAdded.listen(this._evaluateEntity, this);
		this._world.onComponentRemoved.listen(this._evaluateEntity, this);
		this._world.onEntityFreed.listen(this._evaluateEntity, this);	// @TODO can just remove the entity directly, no need to evaluate
	}

	public forEach(callBack: (e: Entity) => void): void {
		for (let ii = this._entities.length - 1; ii >= 0; ii--) {
			const entity = this._entities[ii];
			callBack(entity);
		}
	}

	private _evaluateEntity(entity: Entity): void {
		const idx: number = this._entities.indexOf(entity);
		if (this._filter.isApproved(entity)) {
			if (idx === -1) {
				this._entities.push(entity);
				this._onEntityAdded.fire(entity);
			}
		} else {
			if (idx !== -1) {
				this._entities.splice(idx, 1);
				this._onEntityRemoved.fire(entity);
			}
		}
	}
}