import { Container, DisplayObject } from "@pixi/display";
import { Entity } from "../../ecs/Entity";
import { Family } from "../../ecs/Family";
import { InclusionFilter } from "../../ecs/filters/InclusionFilter";
import { World } from "../../ecs/World";
import { GameComponents, gameComponents } from "../Components";

export class DisplayObjectSystem {
	private _family: Family<GameComponents, "displayObject">;
	private _positionFamily: Family<GameComponents, "displayObject" | "position">;

	private _container: Container;

	private _displayObjectMap: Map<number, DisplayObject> = new Map();

	constructor(world: World<GameComponents>, container: Container) {
		this._container = container;

		this._family = new Family(world, new InclusionFilter(world, [
			"displayObject"
		]));

		this._positionFamily = new Family(world, new InclusionFilter(world, [
			"displayObject",
			"position"
		]));

		this._family.onEntityAdded.listen(this._onEntityAdded, this);
		this._family.onEntityRemoved.listen(this._onEntityRemoved, this);
	}

	public update(): void {
		this._positionFamily.forEach((e, { position, displayObject }) => {
			displayObject.displayObject.position.copyFrom(position);
		})
	}

	public tick(): void {};

	private _onEntityAdded({ id }: Entity, components: typeof this._family.Components): void {
		this._displayObjectMap.set(id, components.displayObject.displayObject);
		this._container.addChild(components.displayObject.displayObject);
	}

	private _onEntityRemoved({ id }: Entity): void {
		const displayObject = this._displayObjectMap.get(id);
		if (!displayObject) return;

		this._container.removeChild(displayObject);
		this._displayObjectMap.delete(id);
	}
}