import { Entity } from "./Entity";
import { ComponentMap, World } from "./World";

export abstract class Filter<Q extends ComponentMap, T extends keyof Q> {
	public abstract isApproved(entity: Entity): boolean ;
	public abstract getIncludedTypes(): T[];
}