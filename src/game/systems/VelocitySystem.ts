import { Family } from "../../ecs/Family";
import { AggregateFilter } from "../../ecs/filters/AggregateFilter";
import { ExclusionFilter } from "../../ecs/filters/ExclusionFilter";
import { InclusionFilter } from "../../ecs/filters/InclusionFilter";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { GameComponents } from "../Components";

export class VelocitySystem extends BaseSystem<GameComponents> {
	private _family: Family<GameComponents>;
	public constructor(world: World<GameComponents>) {
		super(world);

		this._family = new Family(world, new AggregateFilter<GameComponents>([
			new InclusionFilter(world, [
				"position",
				"velocity"
			]),
			new ExclusionFilter(world, [
				"player"	// player has it's own separate movement system (alternatively, stick player velocity on player component?)
			])
		]));
	}

	public override tick(): void {
		this._family.forEach(entity => {
			const position = this._world.getComponent(entity, "position");
			const velocity = this._world.getComponent(entity, "velocity");

			this._world.addComponent(entity, "position", {
				x: position.x + velocity.x,
				y: position.y + velocity.y
			});
		})
	}
}