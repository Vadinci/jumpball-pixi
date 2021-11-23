import * as BaseFamily from "../ecs/Family";
import { InclusionFilter } from "../ecs/filters/InclusionFilter";
import * as BaseWorld from "../ecs/World";
import { GameComponents } from "./Components";
import { ISystem } from "./interfaces/ISystem";

// re-exports with GameComponents baked in
export class Family<T extends keyof GameComponents> extends BaseFamily.Family<GameComponents, T> { };
export type FamilyComponents<T extends keyof GameComponents> = BaseFamily.FamilyComponents<GameComponents, T>;
export type FamilyCallback<T extends keyof GameComponents> = BaseFamily.FamilyCallback<GameComponents, T>;

export class World extends BaseWorld.World<GameComponents> { };


export abstract class BaseSystem implements ISystem {
	protected readonly _world: World;

	constructor(world: World) {
		this._world = world;
	}

	public update(dt: number): void {

	}

	public tick(): void {

	}

	protected _createFamily<T extends keyof GameComponents>(components: T[]): Family<T> {
		return new Family(this._world, new InclusionFilter(this._world, components));
	};
}