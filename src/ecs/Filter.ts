import { Entity } from "./Entity";
import { ComponentMap } from "./World";

export abstract class Filter<T extends ComponentMap> {
	public abstract isApproved(entity: Entity): boolean;
	public abstract getIncludedTypes(): (keyof T)[];
}