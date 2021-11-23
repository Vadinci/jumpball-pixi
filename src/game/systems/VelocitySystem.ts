import { BaseSystem, Family, World } from "../BaseSystem";

export class VelocitySystem extends BaseSystem {
	private _family: Family<"position" | "velocity">;

	constructor(world: World) {
		super(world);

		this._family = this._createFamily([
			"position",
			"velocity"
		]);
	}

	public override tick(): void {
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