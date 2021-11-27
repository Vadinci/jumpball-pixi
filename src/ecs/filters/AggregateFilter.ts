import { Filter } from "../Filter";
import { Entity } from "../Entity";
import { ComponentMap, World } from "../World";

export class AggregateFilter<T extends ComponentMap> extends Filter<T> {
	private _filters: Filter<T>[];

	constructor(filters: Filter<T>[]) {
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

	public getIncludedTypes(): (keyof T)[] {
		return this._filters.reduce((allTypes: (keyof T)[], filter) => {
			allTypes.push(...filter.getIncludedTypes());
			return allTypes;
		}, [])
	}
}