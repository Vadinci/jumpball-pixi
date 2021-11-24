import { Family } from "../ecs/Family";
import { InclusionFilter } from "../ecs/filters/InclusionFilter";
import { ComponentMap, World } from "../ecs/World";
import { GameComponents } from "./Components";
import { ISystem } from "./interfaces/ISystem";

export abstract class BaseSystem<T extends ComponentMap> implements ISystem {
	protected readonly _world: World<T>;

	constructor(world: World<T>) {
		this._world = world;
	}

	public update(dt: number): void {

	}

	public tick(): void {

	}

	protected _createFamily(components: (keyof T)[]): Family<T> {
		return new Family(this._world, new InclusionFilter(this._world, components));
	};
}