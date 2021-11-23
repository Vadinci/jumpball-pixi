import { BaseSystem, Family, World } from "../BaseSystem";

export class PaddleRemovalSystem extends BaseSystem {
	private _family: Family<"position">;

	constructor(world: World) {
		super(world);

		this._family = this._createFamily([
			"position"
			// @TODO add paddle component
		]);
	}

	public override tick(): void {
		this._family.forEach((entity, components) => {
			if (components.position.y >= 550) {
				this._world.freeEntity(entity);
			}
		})
	}
}