import { Family } from "../../ecs/Family";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { GameComponents } from "../Components";

export class PaddleRemovalSystem extends BaseSystem<GameComponents> {
	private _family: Family<GameComponents>;

	constructor(world: World<GameComponents>) {
		super(world);

		this._family = this._createFamily([
			"position"
			// @TODO add paddle component
		]);
	}

	public override tick(): void {
		this._family.forEach(entity => {
			const position = this._world.getComponent(entity, "position");
			if (position.y >= 580) { // @TODO find bottom of screen
				this._world.freeEntity(entity);
			}
		})
	}
}