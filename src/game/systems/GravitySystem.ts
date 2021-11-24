import { Family } from "../../ecs/Family";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { GameComponents } from "../Components";
import { GRAVITY } from "../Constants";

export class GravitySystem extends BaseSystem<GameComponents> {
	private _family: Family<GameComponents>;

	constructor(world: World<GameComponents>) {
		super(world);

		this._family = this._createFamily([
			"velocity",
			"gravity"
		]);
	}

	public override tick(): void {
		this._family.forEach(entity => {
			const oldVelocity = this._world.getComponent(entity, "velocity");

			this._world.addComponent(entity, "velocity", {
				x: oldVelocity.x,
				y: oldVelocity.y + GRAVITY
			})
		});
	};
}