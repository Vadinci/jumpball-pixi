import { Container, DisplayObject } from "@pixi/display";
import { Entity } from "../../ecs/Entity";
import { Family, FamilyComponents } from "../../ecs/Family";
import { InclusionFilter } from "../../ecs/filters/InclusionFilter";
import { World } from "../../ecs/World";
import { GameComponents } from "../Components";
import { GRAVITY } from "../Constants";
import { Game } from "../Game";

export class GravitySystem {
	private _family: Family<GameComponents, "velocity" | "gravity">;
	private _world: World<GameComponents>;

	constructor(world: World<GameComponents>) {
		this._world = world;

		this._family = new Family(world, new InclusionFilter(world, [
			"velocity",
			"gravity"
		]));
	}

	public update(): void { }

	public tick(): void {
		this._family.forEach((entity, components) => {
			this._world.addComponent(entity, "velocity", {
				x: components.velocity.x,
				y: components.velocity.y + GRAVITY
			})
		});
	};
}