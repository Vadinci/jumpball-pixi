import { Container, DisplayObject } from "@pixi/display";
import { Entity } from "../../ecs/Entity";
import { BaseSystem, Family, FamilyComponents, World } from "../BaseSystem";

export class DisplayObjectSystem extends BaseSystem {
	private _family: Family<"displayObject">;
	private _positionFamily: Family<"displayObject" | "position">;

	private _container: Container;

	private _displayObjectMap: Map<number, DisplayObject> = new Map();

	constructor(world: World, container: Container) {
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
		this._positionFamily.forEach((e, { position, displayObject }) => {
			displayObject.displayObject.position.copyFrom(position);
		})
	}

	private _onEntityAdded({ id }: Entity, components: FamilyComponents<"displayObject">): void {
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