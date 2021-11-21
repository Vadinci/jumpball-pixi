import { Entity } from "./Entity";

export class Component<T extends {}> {

	private _entityMap: Map<number, T> = new Map();

	constructor() {

	};

	public addToEntity(entity: Entity, data: T): void {
		this._entityMap.set(entity.id, data);
	}

	public getEntityData(entity: Entity): T {
		const data = this._entityMap.get(entity.id);
		if (!data) {
			throw "Component not available on entity";
		}
		return data;
	}

	public removeFromEntity(entity: Entity): void {
		this._entityMap.delete(entity.id);
	}

	public isOnEntity(entity: Entity): boolean {
		return this._entityMap.has(entity.id);
	}
}