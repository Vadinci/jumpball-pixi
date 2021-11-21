import { Texture } from "@pixi/core";
import { DisplayObject } from "@pixi/display";
import { NineSlicePlane } from "@pixi/mesh-extras";

export class Platform {
	private _sprite: NineSlicePlane;
	private _width: number;

	public get sprite(): DisplayObject {
		return this._sprite;
	}

	public get left(): number {
		return this._sprite.x - this._width/2
	}

	public get right(): number {
		return this._sprite.x + this._width/2
	}

	constructor(texture: Texture, width: number) {
		width = Math.round(width / 2) * 2;
		this._width = width;

		this._sprite = new NineSlicePlane(texture, 8, 4, 8, 4);
		this._sprite.pivot.set(width / 2, 0);
		this._sprite.width = width;
	}
}