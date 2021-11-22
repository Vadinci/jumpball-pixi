import { Family } from "../../ecs/Family";
import { InclusionFilter } from "../../ecs/filters/InclusionFilter";
import { World } from "../../ecs/World";
import { GameComponents } from "../Components";

export class VelocitySystem {
	private _family: Family<GameComponents, "position" | "velocity">;

	private _world: World<GameComponents>;

	constructor(world: World<GameComponents>) {
		this._world = world;

		this._family = new Family(world, new InclusionFilter(world, [
			"position",
			"velocity"
		]));
	}

	public update(): void { }

	public tick(): void {
		this._family.forEach((entity, { position, velocity }) => {

			if (this._world.hasComponent(entity, "resolvedCollision")) {
				const collision = this._world.getComponent(entity, "resolvedCollision");

				this._world.addComponent(entity, "position", {
					x: position.x,
					y: collision.newY
				});

				this._world.addComponent(entity, "velocity", {
					x: velocity.x,
					y: collision.newVY
				});

				this._world.removeComponent(entity, "resolvedCollision");

				return;
			}

			this._world.addComponent(entity, "position", {
				x: position.x + velocity.x,
				y: position.y + velocity.y,
			})
		});
	};
}