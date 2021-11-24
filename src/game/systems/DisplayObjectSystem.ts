import { Container, DisplayObject } from "@pixi/display";
import { Entity } from "../../ecs/Entity";
import { Family } from "../../ecs/Family";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { GameComponents } from "../Components";

export class DisplayObjectSystem extends BaseSystem<GameComponents> {
	private _family: Family<GameComponents>;
	private _positionFamily: Family<GameComponents>;

	private _container: Container;

	private _displayObjectMap: Map<number, DisplayObject> = new Map();

	constructor(world: World<GameComponents>, container: Container) {
		super(world);
		this._container = container;

		this._family = this._createFamily([
			"displayObject"
		]);

		this._positionFamily = this._createFamily([
			"displayObject",
			"position"
		]);

		this._family.onEntityAdded.listen(this._onEntityAdded, this);
		this._family.onEntityRemoved.listen(this._onEntityRemoved, this);
	}

	public override update(): void {
		this._positionFamily.forEach(entity => {
			const { displayObject } = this._world.getComponent(entity, "displayObject");
			const position = this._world.getComponent(entity, "position");

			displayObject.position.copyFrom(position);
		})
	}

	private _onEntityAdded(entity: Entity): void {
		const { displayObject } = this._world.getComponent(entity, "displayObject");

		this._displayObjectMap.set(entity.id, displayObject);
		this._container.addChild(displayObject);
	}

	private _onEntityRemoved(entity: Entity): void {
		const displayObject = this._displayObjectMap.get(entity.id);
		if (!displayObject) return;

		this._container.removeChild(displayObject);
		this._displayObjectMap.delete(entity.id);
	}
}