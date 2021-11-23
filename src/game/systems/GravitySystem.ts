import { BaseSystem, World, Family } from "../BaseSystem";
import { GRAVITY } from "../Constants";

export class GravitySystem extends BaseSystem {
	private _family: Family<"velocity" | "gravity">;

	constructor(world: World) {
		super(world);

		this._family = this._createFamily([
			"velocity",
			"gravity"
		]);
	}

	public override tick(): void {
		this._family.forEach((entity, components) => {
			this._world.addComponent(entity, "velocity", {
				x: components.velocity.x,
				y: components.velocity.y + GRAVITY
			})
		});
	};
}