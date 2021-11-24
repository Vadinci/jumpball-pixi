import { Family } from "../../ecs/Family";
import { World } from "../../ecs/World";
import { BaseSystem} from "../BaseSystem";
import { GameComponents } from "../Components";

export class VelocitySystem extends BaseSystem<GameComponents> {
	private _family: Family<GameComponents>;

	constructor(world: World<GameComponents>) {
		super(world);

		this._family = this._createFamily([
			"position",
			"velocity"
		]);
	}

	public override tick(): void {
		this._family.forEach(entity => {

			const position = this._world.getComponent(entity, "position");
			const velocity = this._world.getComponent(entity, "velocity");

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