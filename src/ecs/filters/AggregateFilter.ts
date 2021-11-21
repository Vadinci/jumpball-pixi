import { Filter } from "../Filter";
import { Entity } from "../Entity";
import { ComponentMap, World } from "../World";

export class AggregateFilter<Q extends ComponentMap, T extends keyof Q> extends Filter<Q, T> {
	private _filters: Filter<Q, T>[];

	constructor(/*world: World<Q>,*/ filters: Filter<Q, T>[]) {
		super();
		this._filters = filters;
	}

	public isApproved(entity: Entity): boolean {
		for (let ii = 0; ii < this._filters.length; ii++) {
			if (!this._filters[ii].isApproved(entity)) {
				return false;
			}
		}
		return true;
	}

	public getIncludedTypes(): T[] {
		return this._filters.reduce((allTypes: T[], filter) => {
			allTypes.push(...filter.getIncludedTypes());
			return allTypes;
		}, [])
	}
}